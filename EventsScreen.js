import React from "react";
import { StyleSheet, View } from "react-native";
import { Input, Header, Text, Button, SocialIcon } from "react-native-elements";
import { Agenda } from "react-native-calendars";
import ApolloClient from "apollo-boost";
import { ApolloProvider, Query, ApolloConsumer, Mutation } from "react-apollo";
import gql from "graphql-tag";

const client = new ApolloClient({
  uri: "https://48p1r2roz4.sse.codesandbox.io",
  clientState: {
    // defaults: {
    //   getEventsByDate: [
    //     {
    //       __typename: "EVENT",
    //       id: 1,
    //       name: "TestName1",
    //       body: "TestBody1",
    //       date: dateToYMD(new Date())
    //     }
    //   ]
    // },
    resolvers: {
      Query: {
        getEventsByDate: (_, { date }, { cache }) => {
          const events = [
            {
              __typename: "EVENT",
              id: 1,
              name: "TestName1",
              body: "TestBody1",
              date: dateToYMD(new Date())
            },
            {
              __typename: "EVENT",
              id: 2,
              name: "TestName2",
              body: "TestBody2",
              date: "2019-02-20"
            },
            {
              __typename: "EVENT",
              id: 3,
              name: "TestName3",
              body: "TestBody3",
              date: "2019-03-05"
            },
            {
              __typename: "EVENT",
              id: 4,
              name: "TestName4",
              body: "TestBody4",
              date: "2019-03-10"
            }
          ];

          const filteredEvents = events.filter(el => {
            const elemDate = el.date.split("-");
            const askingDate = date.split("-");

            // console.log(
            //   elemDate[0] +
            //     ", " +
            //     askingDate[0] +
            //     ", " +
            //     elemDate[1] +
            //     ", " +
            //     askingDate[1] +
            //     ", " +
            //     elemDate[2] +
            //     ", " +
            //     askingDate[2]
            // );

            return (
              elemDate[0] === askingDate[0] && elemDate[1] === askingDate[1]
            );
          });
          return filteredEvents;
        }
      },
      Mutation: {
        addEvent: (_, args, { cache }) => {
          return null;
        }
      }
    }
  }
});

const GET_EVENTS = gql`
  query GetEvents @client {
    events {
      id
      name
      body
      date
    }
  }
`;

const GET_EVENTS_BY_DATE = gql`
  query GetEventsByDate($date: String!) {
    getEventsByDate(date: $date) @client {
      id
      name
      body
      date
    }
  }
`;

function dateToYMD(date) {
  return date.toISOString().split("T")[0]; //?
}

function renderEmptyDate() {
  return (
    <View style={styles.emptyDate}>
      <Text h4 style={{ textAlign: "center" }}>
        No events
      </Text>
    </View>
  );
}

function rowHasChanged(r1, r2) {
  return r1.id !== r2.id;
}

const renderItem = function(item) {
  return (
    <View style={styles.item}>
      <Text h4 style={{ textAlign: "center" }}>
        {item.name}
      </Text>
      <Text h5>{item.body}</Text>
    </View>
  );
};

function arrayToObject(arr) {
  if (arr == null) return null;

  var obj = {};
  arr.forEach(element => {
    obj[element.date] = [element];
  });

  return obj;
}

function loadItems(month) {
  console.log(month);
}

class AgendaComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: null
    };

    this.currentDate = dateToYMD(new Date());
  }

  render() {
    return (
      <Query
        query={GET_EVENTS_BY_DATE}
        variables={{ date: this.currentDate.substring(0, 7) }}
      >
        {({ data, loading, error, refetch, fetchMore, cache }) => {
          if (error) return <Text>Error</Text>;
          if (loading) return <Text>Loading</Text>;

          //console.log(arrayToObject(data.getEventsByDate));

          return (
            <Agenda
              items={arrayToObject(data.getEventsByDate)}
              onDayPress={day => {
                this.currentDate = day.dateString;
                //refetch({ variables: { date: day } });
                fetchMore({
                  variables: { date: this.currentDate.substring(0, 7) },
                  updateQuery: (prev, { fetchMoreResult }) => {
                    // const combination = {
                    //   getEventsByDate: [
                    //     ...prev.getEventsByDate,
                    //     ...fetchMoreResult.getEventsByDate
                    //   ]
                    // };
                    if (!fetchMoreResult) return prev;
                    const combination = Object.assign({}, prev, {
                      getEventsByDate: [
                        ...prev.getEventsByDate,
                        ...fetchMoreResult.getEventsByDate
                      ]
                    });
                    console.log(combination);
                    return combination;
                    //return combination;
                  }
                });
                console.log(
                  "cache: " +
                    client.cache.readQuery({
                      query: GET_EVENTS_BY_DATE,
                      variables: { date: this.currentDate.substring(0, 7) }
                    })
                );
              }}
              loadItemsForMonth={month => {
                //this.currentDate = month.dateString;
                //refetch({ variables: { date: this.currentDate } });
                // fetchMore({
                //   variables: { date: this.currentDate },
                //   updateQuery: (prev, { fetchMoreResult }) => {
                //     const combination = {
                //       getEventsByDate: [
                //         ...prev.getEventsByDate,
                //         ...fetchMoreResult.getEventsByDate
                //       ]
                //     };
                //     console.log(fetchMoreResult);
                //     return combination;
                //     // if (!fetchMoreResult) return prev;
                //     // return Object.assign({}, prev, {
                //     //   getEventsByDate: [
                //     //     ...prev.getEventsByDate,
                //     //     ...fetchMoreResult.getEventsByDate
                //     //   ]
                //     // });
                //   }
                // });
              }}
              selected={this.currentDate}
              renderItem={renderItem}
              renderEmptyDate={renderEmptyDate}
              rowHasChanged={rowHasChanged}
              pastScrollRange={5}
              futureScrollRange={3}
            />
          );
        }}
      </Query>
    );
  }
}

export default class EventsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: {}
    };
  }

  static navigationOptions = {
    title: "События"
  };

  render() {
    return (
      <ApolloProvider client={client}>
        <AgendaComponent />
      </ApolloProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    alignItems: "stretch",
    justifyContent: "center"
  },
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  }
});

import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Input,
  Header,
  Text,
  Button,
  SocialIcon,
  Divider
} from "react-native-elements";
import { Agenda } from "react-native-calendars";
import ApolloClient from "apollo-boost";
import { ApolloProvider, Query, ApolloConsumer, Mutation } from "react-apollo";
import gql from "graphql-tag";
import lodash from "lodash";

const events = [
  {
    __typename: "EVENT",
    id: 1,
    name: "Название события",
    body:
      "Тестовое сообщение о событии, которое будет проходить где-то в такое-то время!",
    date: dateToYMD(new Date()),
    timeStart: "10:00",
    timeEnd: "13:00",
    hash: 1
  },
  {
    __typename: "EVENT",
    id: 2,
    name: "TestName2",
    body: "TestBody2",
    date: "2019-02-28",
    timeStart: "10:00",
    timeEnd: "13:00",
    hash: 1
  },
  {
    __typename: "EVENT",
    id: 3,
    name: "TestName3",
    body: "TestBody3",
    date: "2019-03-05",
    timeStart: "10:00",
    timeEnd: "13:00",
    hash: 1
  },
  {
    __typename: "EVENT",
    id: 4,
    name: "TestName4",
    body: "TestBody4",
    date: "2019-04-01",
    timeStart: "10:00",
    timeEnd: "13:00",
    hash: 1
  }
];

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
        getEventsByDate: async (_, { date }, { cache }) => {
          const filteredEvents = events.filter(el => {
            const elemDate = el.date.split("-");
            const askingDate = date.split("-");

            return (
              elemDate[0] === askingDate[0] && elemDate[1] === askingDate[1]
            );
          });

          await new Promise(r => setTimeout(r, 1200));

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
      timeStart
      timeEnd
      hash
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
      timeStart
      timeEnd
      hash
    }
  }
`;

function dateToYMD(date) {
  return date.toISOString().split("T")[0];
}

class AgendaComponent extends React.Component {
  constructor(props) {
    super(props);

    this.currentDate = dateToYMD(new Date());
  }

  render() {
    return (
      <Query
        query={GET_EVENTS_BY_DATE}
        variables={{ date: this.currentDate }}
        notifyOnNetworkStatusChange
      >
        {({ data, error, refetch, fetchMore, networkStatus }) => {
          if (error)
            return (
              <View>
                <Text>Error</Text>
              </View>
            );

          const events = this.arrayToObject(data.getEventsByDate);

          return (
            <Agenda
              items={events}
              onDayPress={date => {
                this.currentDate = date.dateString;
              }}
              loadItemsForMonth={month => {
                fetchMore({
                  variables: { date: month.dateString },
                  updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev;

                    const combination = {
                      getEventsByDate: lodash.unionBy(
                        prev.getEventsByDate,
                        fetchMoreResult.getEventsByDate,
                        x => x.id
                      )
                    };

                    return combination;
                  }
                });
              }}
              //onDayChange={(day)=>{console.log('day changed')}}
              selected={this.currentDate}
              renderItem={this.renderItem}
              renderEmptyDate={this.renderEmptyDate}
              rowHasChanged={this.rowHasChanged}
              pastScrollRange={5}
              futureScrollRange={5}
              onRefresh={() => {
                refetch({ date: this.currentDate });
              }}
              refreshing={networkStatus === 4}
              //refreshControl={null}
            />
          );
        }}
      </Query>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}>
        {/* <Text h4 style={{ textAlign: "center" }}>
          No events
        </Text> */}
      </View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.id + r1.hash !== r2.id + r2.hash;
  }

  renderItem(item) {
    return (
      <View style={styles.item}>
        <Text style={{ textAlign: "left", fontSize: 20 }}>{`${
          item.timeStart
        } - ${item.timeEnd}`}</Text>
        <Text
          style={{
            textAlign: "left",
            fontSize: 22,
            fontWeight: "bold",
            marginTop: 5,
            marginBottom: 5
          }}
        >
          {item.name}
        </Text>
        <Text style={{ textAlign: "left", fontSize: 20, color: "#505064" }}>
          {item.body}
        </Text>
      </View>
    );
  }

  loadItems(month) {
    console.log(month);
  }

  arrayToObject(arr) {
    if (arr == null) return null;

    var obj = {};
    arr.forEach(element => {
      if (!obj[element.date]) obj[element.date] = [element];
      else obj[element.date].push(element);
    });

    return obj;
  }
}

export default class EventsScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    title: "События"
  };

  render() {
    return (
      <ApolloProvider client={client}>
        <AgendaComponent />
        <Button
          title="Add event"
          onPress={() => {
            events.push({
              __typename: "EVENT",
              id: events.length + 5,
              name: "TestName" + (events.length + 5),
              body: "TestBody" + (events.length + 5),
              date: dateToYMD(new Date()),
              timeStart: "10:00",
              timeEnd: "13:00",
              hash: 1
            });
          }}
        />
        <Button
          title="Shift event"
          onPress={() => {
            events.shift();
          }}
        />
        <Button
          title="change hash and text event[0]"
          onPress={() => {
            events[0].hash = Math.round(Math.random() * 10000);
            events[0].body = "TestBody" + Math.random();
          }}
        />
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

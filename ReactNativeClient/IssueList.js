import React, {useState} from 'react';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    Button,
    useColorScheme,
    View,
  } from 'react-native';

  const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

  function jsonDateReviver(key, value) {
    if (dateRegex.test(value)) return new Date(value);
    return value;
  }

  async function graphQLFetch(query, variables = {}) {
    try {
        /****** Q4: Start Coding here. State the correct IP/port******/
        const response = await fetch('http://192.168.10.122:3000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ query, variables })
        /****** Q4: Code Ends here******/
      });
      const body = await response.text();
      const result = JSON.parse(body, jsonDateReviver);
  
      if (result.errors) {
        const error = result.errors[0];
        if (error.extensions.code == 'BAD_USER_INPUT') {
          const details = error.extensions.exception.errors.join('\n ');
          alert(`${error.message}:\n ${details}`);
        } else {
          alert(`${error.extensions.code}: ${error.message}`);
        }
      }
      return result.data;
    } catch (e) {
      alert(`Error in sending data to server: ${e.message}`);
    }
  }

class IssueFilter extends React.Component {
    render() {
      return (
        <View>
        {/****** Q1: Start Coding here. ******/}
        <Text>This is a placeholder for the issue filter.</Text>
        {/****** Q1: Code ends here ******/}
        </View>
      );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  header: { height: 50, backgroundColor: '#537791' },
  text: { textAlign: 'center' },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: '#E7E6E1' }
  });

const width= [40,80,80,80,80,80,200];

function IssueRow(props) {
    const issue = props.issue;
    {/****** Q2: Coding Starts here. Create a row of data in a variable******/}
    const rowData = (
      <View style={styles.row}>
        <Text>{issue.id}</Text>
        <Text>{issue.status}</Text>
        <Text>{issue.owner}</Text>
        <Text>{issue.created.toDateString()}</Text>
        <Text>{issue.effort}</Text>
        <Text>{issue.due ? issue.due.toDateString() : ''}</Text>
        <Text>{issue.title}</Text>
      </View>

    );
    {/****** Q2: Coding Ends here.******/}
    return (
      <View>
      {/****** Q2: Start Coding here. Add Logic to render a row  ******/}
      {rowData}
      {/****** Q2: Coding Ends here. ******/}  
      </View>
    );
  }
  
  
  function IssueTable(props) {
    const issueRows = props.issues.map(issue =>
      <IssueRow key={issue.id} issue={issue} />
    );

    {/****** Q2: Start Coding here. Add Logic to initalize table header  ******/}
    const tableHeader = (
      <View>
        <Text>ID</Text>
        <Text>Status</Text>
        <Text>Owner</Text>
        <Text>Created</Text>
        <Text>Effort</Text>
        <Text>Due Date</Text>
        <Text>Title</Text>
      </View>
    );

    {/****** Q2: Coding Ends here. ******/}
    
    
    return (
    <View style={styles.container}>
    {/****** Q2: Start Coding here to render the table header/rows.**********/}
    {tableHeader}
    {issueRows}
    {/****** Q2: Coding Ends here. ******/}
    </View>
    );
  }

  
  class IssueAdd extends React.Component {
    constructor() {
      super();
      this.handleSubmit = this.handleSubmit.bind(this);
      /****** Q3: Start Coding here. Create State to hold inputs******/
      this.state = {owner: '', title: '',  };
      this.handleChange = this.handleChange.bind(this);
      /****** Q3: Code Ends here. ******/
    }
  
    /****** Q3: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
    handleChange(name, value) {this.setState({ [name]: value });}
    /****** Q3: Code Ends here. ******/
    
    handleSubmit() {
      /****** Q3: Start Coding here. Create an issue from state variables and call createIssue. Also, clear input field in front-end******/
      const { owner, title } = this.state;
      if (owner && title) {
        const issue = {
          owner,
          title,
          due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10),
        };
        this.props.createIssue(issue);
        this.setState({ owner: '', title: '' });
      }
    }
      /****** Q3: Code Ends here. ******/
  
    render() {
      return (
          <View>
          {/****** Q3: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
          <TextInput
          placeholder="Owner"
          value={this.state.owner}
          onChangeText={(text) => this.handleChange('owner', text)}
          />
          <TextInput
          placeholder="Title"
          value={this.state.title}
          onChangeText={(text) => this.handleChange('title', text)}
          />
          <Button
          title="Add"
          onPress={this.handleSubmit}
          />
          {/****** Q3: Code Ends here. ******/}
          </View>
      );
    }
  }


class BlackList extends React.Component {
    constructor()
    {   super();
        this.handleSubmit = this.handleSubmit.bind(this);
        /****** Q4: Start Coding here. Create State to hold inputs******/
        this.state = {name: ''};
        /****** Q4: Code Ends here. ******/
    }
    /****** Q4: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
    setName(newname)
    {
      this.setState({name: newname});
    }
    /****** Q4: Code Ends here. ******/

    async handleSubmit() {
    /****** Q4: Start Coding here. Create an issue from state variables and issue a query. Also, clear input field in front-end******/
    const query = 'mutation myaddToBlacklist ($newname: String!){addToBlacklist(nameInput: $newname)}';
    const newname = this.state.name;
    console.log(newname)
    const data = await graphQLFetch(query, {newname});
    this.newnameInput.clear();
    /****** Q4: Code Ends here. ******/
    }

    render() {
    return (
        <View>
        {/****** Q4: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
        <TextInput
            ref={input => { this.newnameInput = input; }}
            placeholder="Name To Blacklist"
            value={this.state.name}
            onChangeText={(text) => this.setName(text)}
        />
        <Button onPress={this.handleSubmit} title="Add To Blacklist"/>
        {/****** Q4: Code Ends here. ******/}
        </View>
    );
    }
}

export default class IssueList extends React.Component {
    constructor() {
        super();
        this.state = { issues: [] };
        this.createIssue = this.createIssue.bind(this);
    }
    
    componentDidMount() {
    this.loadData();
    }

    async loadData() {
    const query = `query {
        issueList {
        id title status owner
        created effort due
        }
    }`;

    const data = await graphQLFetch(query);
    if (data) {
        this.setState({ issues: data.issueList });
    }
    }

    async createIssue(issue) {
    const query = `mutation issueAdd($issue: IssueInputs!) {
        issueAdd(issue: $issue) {
        id
        }
    }`;

    const data = await graphQLFetch(query, { issue });
    if (data) {
        this.loadData();
    }
    }
    
    
    render() {
    return (
    <>
    {/****** Q1: Start Coding here. ******/}
    <IssueFilter/>
    {/****** Q1: Code ends here ******/}


    {/****** Q2: Start Coding here. ******/}
    <IssueTable issues={this.state.issues}/>
    {/****** Q2: Code ends here ******/}

    
    {/****** Q3: Start Coding here. ******/}
    <IssueAdd createIssue={this.createIssue}/>
    {/****** Q3: Code Ends here. ******/}

    {/****** Q4: Start Coding here. ******/}
    <BlackList/>
    {/****** Q4: Code Ends here. ******/}
    </>
      
    );
  }
}

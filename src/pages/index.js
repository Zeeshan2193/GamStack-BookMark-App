import React from "react";
import { useQuery, useMutation } from '@apollo/client';
import gql from "graphql-tag";

const BookMarksQuery = gql`{
  bookmark{
    id
    url
    description
  }
}`

const AddBookmarkMutation = gql`
  mutation addBookmark($url: String!, $description: String!){
    addBookmark(url: $url, description: $description){
      url
    }
  }
`

export default function Home() {
const {loading, error, data} = useQuery(BookMarksQuery);
const [addBookmark] = useMutation(AddBookmarkMutation);
let textfield;
let description;
const addBookMarkSubmit = ()=> {
  addBookmark({
    variables: {
        url: textfield.value,
        description : description.value 
    },
    refetchQueries : [{query: BookMarksQuery }],
  })
console.log('textfield', textfield.value);
console.log('Description', description.value);
}
  return (
    <div>
    <p>{JSON.stringify(data)}</p>

    <div>
        <input type="text" placeholder = "Url" ref={node=>textfield=node} /><br />
        <input type="text" placeholder = "Description" ref={node=>description=node} />
        <button onClick={addBookMarkSubmit}>Add BookMark</button>
    </div>
    </div>
  )
}

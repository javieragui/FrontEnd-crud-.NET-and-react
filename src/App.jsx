import React, {useState, useEffect} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';

function App() {
  const baseUrl = "https://localhost:5001/person";
  const [data, setData] = useState([]);
  const [modalInsert, setModalInsert] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [itemSelected, setItemSelected] = useState({
    Person_id: '',
    Name: '',
    Age: '',
    Date_init: ''
  });
  const requestGet = async() => {
    await axios.get(baseUrl)
    .then(response => {
      setData(response.data);
    }).catch(error => {
      console.log(error);
    })
  };
  const requestPost = async() => {
    delete itemSelected.Person_id;
    await axios.post(baseUrl, itemSelected)
    .then(response => {
      setData(data.concat(response.data));
      isInsertOpenOrClose();
    }).catch(error => {
      console.log(error);
    })
  };
  const requestPut = async() => {
    await axios.put(baseUrl + "/" + itemSelected.Person_id, itemSelected)
    .then(res => {
      var response = res.data;
      var auxData = data;
      auxData.map(person => {
        if (person.Person_id === itemSelected.Person_id){
          person.Person_id = response.Person_id;
          person.Name = response.Name;
          person.Age = response.Age;
          person.Date_init = response.Date_init;
        }
      })
      isEditOpenOrClose();
    }).catch(error => {
      console.log(error);
    })
  };
  const requestDelete = async() => {
    await axios.delete(baseUrl + "/" + itemSelected.Person_id)
    .then(res => {
      isDeleteOpenOrClose();
      requestGet();
    }).catch(error => {
      console.log(error);
    })
  };
  const handleChange = e => {
    const {name, value} = e.target;
    setItemSelected({
      ...itemSelected,
      [name]: value
    });
    console.log(itemSelected);
  };
  const isInsertOpenOrClose = () => {
    setModalInsert(!modalInsert);
  }
  const isEditOpenOrClose = () => {
    setModalEdit(!modalEdit);
  }
  const isDeleteOpenOrClose = () => {
    setModalDelete(!modalDelete);
  }
  const isSelectedItemEdit = (item, caseSelected) => {
    setItemSelected(item);
    (caseSelected==="Edit")?
    isEditOpenOrClose(): isDeleteOpenOrClose();
  }
  useEffect(() => {
    requestGet();
  }, [])

  return (
    <div className="App">
        <button className="btn btn-success m-3" onClick={()=>isInsertOpenOrClose()}>Add New Person</button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>AGE</th>
            <th>DATE INIT</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {data.map(person => {
            return(
              <tr key = {person.Person_id}>
                <td>{person.Person_id}</td>
                <td>{person.Name}</td>
                <td>{person.Age}</td>
                <td>{person.Date_init}</td>
                <td>
                  <button className="btn btn-primary" onClick={()=>isSelectedItemEdit(person, "Edit")}>Edit</button>
                  <button className="btn btn-danger" onClick={()=>isSelectedItemEdit(person, "Delete")}>Delete</button>
                </td>
              </tr>
            )})}
      </tbody>
      </table>

      <Modal isOpen={modalInsert}>
      <ModalHeader>Insert Person in the DataBase</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>Name: </label>
          <br/>
          <input type="text" className="form-control" name="Name" onChange={handleChange}/>
          <br/>
          <label>Age: </label>
          <br/>
          <input type="number" className="form-control" name="Age" onChange={handleChange}/>
          <br/>
          <label>Data init: </label>
          <br/>
          <input type="text" className="form-control" name="Date_init" onChange={handleChange}/>
          <br/>
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>requestPost()}>Insert</button>
        <button className="btn btn-danger" onClick={()=>isInsertOpenOrClose()}>Cancel</button>
      </ModalFooter>
      </Modal>

      <Modal isOpen={modalEdit}>
      <ModalHeader>Edit Person in the DataBase</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>ID: </label>
          <br/>
          <input type="text" className="form-control" readOnly value={itemSelected && itemSelected.Person_id}/>
          <br/>
          <label>Name: </label>
          <br/>
          <input type="text" className="form-control" name="Name" onChange={handleChange} value={itemSelected && itemSelected.Name}/>
          <br/>
          <label>Age: </label>
          <br/>
          <input type="number" className="form-control" name="Age" onChange={handleChange} value={itemSelected && itemSelected.Age}/>
          <br/>
          <label>Data init: </label>
          <br/>
          <input type="text" className="form-control" name="Date_init" onChange={handleChange} value={itemSelected && itemSelected.Date_init}/>
          <br/>
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>requestPut()}>Edit</button>
        <button className="btn btn-danger" onClick={()=>isEditOpenOrClose()}>Cancel</button>
      </ModalFooter>
      </Modal>

      <Modal isOpen={modalDelete}>
      <ModalBody>
        Are you sure to eliminate the {itemSelected && itemSelected.Name} in the DataBase?
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-danger" onClick={()=>requestDelete()}>Yes</button>
        <button className="btn btn-secondary" onClick={()=>isDeleteOpenOrClose()}>No</button>
      </ModalFooter>
      </Modal>
    </div>
  );
}
export default App;

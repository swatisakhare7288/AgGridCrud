import React, { useState, useEffect } from "react";
import "./App.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { Grid, Button } from "@material-ui/core";
import FormDialog from "./components/dialog";
const initialValue = { name: "", email: "", phone: "", dob: "" };
function App() {
  const [gridApi, setGridApi] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = useState(initialValue);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData(initialValue);
  };
  const url = `http://localhost:4000/users`;
  const columnDefs = [
    { headerName: "ID", field: "id" },
    { headerName: "Name", field: "name" },
    { headerName: "Email", field: "email" },
    { headerName: "phone", field: "phone" },
    { headerName: "Date of Birth", field: "dob" },
    {
      headerName: "Actions",
      field: "id",
      cellRendererFramework: (params) => (
        <div>
          <Button
            variant="contained"
            style={{
              marginBottom: "0px",
              marginRight: "5px",
              marginLeft: "-5px",
            }}
            color="primary"
            onClick={() => handleUpdate(params.data)}
          >
            Update
          </Button>
          <Button
            variant="contained"
            style={{ marginBottom: "0px", marginRight: "10px" }}
            color="secondary"
            onClick={() => handleDelete(params.value)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];
  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    fetch(url)
      .then((resp) => resp.json())
      .then((resp) => setTableData(resp));
  };
  const onChange = (e) => {
    const { value, id } = e.target;
    console.log(value, id);
    setFormData({ ...formData, [id]: value });
  };
  const onGridReady = (params) => {
    setGridApi(params);
  };

  const handleUpdate = (oldData) => {
    setFormData(oldData);
    handleClickOpen();
  };
  const handleDelete = (id) => {
    const confirm = window.confirm(
      "Are you sure, you want to delete this row",
      id
    );
    if (confirm) {
      fetch(url + `/${id}`, { method: "DELETE" })
        .then((resp) => resp.json())
        .then((resp) => getUsers());
    }
  };
  const handleFormSubmit = () => {
    if (formData.id) {
      //updating a user
      const confirm = window.confirm(
        "Are you sure, you want to update this row ?"
      );
      confirm &&
        fetch(url + `/${formData.id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
          headers: {
            "content-type": "application/json",
          },
        })
          .then((resp) => resp.json())
          .then((resp) => {
            handleClose();
            getUsers();
          });
    } else {
      fetch(url, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "content-type": "application/json",
        },
      })
        .then((resp) => resp.json())
        .then((resp) => {
          handleClose();
          getUsers();
        });
    }
  };

  const defaultColDef = {
    sortable: true,
    flex: 1,
    filter: true,
    floatingFilter: true,
  };
  return (
    <div className="App">
      <h1 align="center">React-App</h1>
      <Grid align="right" style={{ marginBottom: "10px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClickOpen}
          className="button_margin"
        >
          Add user
        </Button>
      </Grid>
      <div className="ag-theme-alpine" style={{ height: "400px" }}>
        <AgGridReact
          rowData={tableData}
          columnDefs={columnDefs}
          // defaultColDef={defaultColDef}
          onGridReady={onGridReady}
        />
      </div>
      <FormDialog
        open={open}
        handleClose={handleClose}
        data={formData}
        onChange={onChange}
        handleFormSubmit={handleFormSubmit}
      />
    </div>
  );
}

export default App;

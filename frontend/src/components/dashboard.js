import React from "react";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {Modal, Button, Table, Form, Alert} from "react-bootstrap";

function Dashboard({token}) {
    const [apiKeys, setApiKeys] = useState([]);
    const [message, setMessage] = useState("");
    const [modal, setModal] = useState(false);
    const [error, setError] = useState(false);
    const [popUp, setPopUp] = useState(false);
    const [apikeyName, setAPIKeyName] = useState("");
    const [createAPIKey, setCreateAPIKey] = useState("");
    const [selectedAPIKey, setSelectedEditAPIKey] = useState(null);
    const [editAPIKeyName, setEditAPIKeyName] = useState("");
    const [editAPIKeyModal, setEditAPIKeyModal] = useState(false);
    const [deleteAPIKeyModal, setDeleteAPIKeyModal] = useState(false);
    const [deleteKey, setDeleteKey] = useState(null);

    const listAPIKeys = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/apikey/keylist", {
                headers: {Authorization: `Bearer ${token}`,},
            });
            setApiKeys(response.data.keys);
        } catch (error) {
            setMessage("Error listing API keys.");
        }
    }, [token]);

    useEffect(() => {
        listAPIKeys();
    }, [listAPIKeys]);

    const showMessage = (msg, isErr = false) => {
        setMessage(msg);
        setError(isErr);
        setPopUp(true);
        setTimeout(() => setPopUp(false), 3000);
        setTimeout(() => setMessage(""), 3000);
    };
    
    const generateAPIKey = () => {
        const key = [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
        setCreateAPIKey(key);
    };

    const saveAPIKey = async () => {
        try {
            await axios.post("http://localhost:5000/api/apikey/save", {apikey: createAPIKey, name: apikeyName}, 
            {
                headers: {Authorization: `Bearer ${token}`}}
            );
            showMessage("API key saved successfully.");
            setModal(false);
            setAPIKeyName("");
            setCreateAPIKey("");
            listAPIKeys();
        } catch (error) {
            showMessage("Error saving API key.",true);
        }
    };

    const statusAPIKey = async (key) => {
        if (key.revoked ===1) return;
        try {
            await axios.post("http://localhost:5000/api/apikey/update", {apikey: key.apikey}, {
                headers: {Authorization: `Bearer ${token}`,},
            });
            showMessage("Status changed to InActive.");
            listAPIKeys();
        } catch (error) {
            showMessage("Error updating API key status.",true);
        }
    };

    const editName = (key) => {
        setSelectedEditAPIKey(key);
        setEditAPIKeyName(key.name || "");
        setEditAPIKeyModal(true);
    };

    const deleteConfirm = (key) => {
        setDeleteAPIKeyModal(true);
        setDeleteKey(key);
    };

    const deleteAPIKey = async (apikey) => {
        try{
            await axios.post("http://localhost:5000/api/apikey/delete", {apikey: deleteKey.apikey}, {
                headers: {Authorization: `Bearer ${token}`,},
            });
            showMessage("API key deleted successfully.");
            setDeleteAPIKeyModal(false);
            listAPIKeys();
        } catch (error) {
            showMessage("Error deleting API key.",true);
        }
    };

    const editAPIKey = async () => {
        try {
            await axios.post("http://localhost:5000/api/apikey/rename", {apikey: selectedAPIKey.apikey, name: editAPIKeyName}, {
                headers: {Authorization: `Bearer ${token}`,},
            });
            showMessage("API key updated successfully.");
            setEditAPIKeyModal(false);
            setSelectedEditAPIKey(null);
            setEditAPIKeyName("");
            listAPIKeys();
        } catch{
            setMessage("Error updating API key.",true);
        }
    };

    return (
        <>
        {popUp && (
            <Alert variant={error ? "danger" : "success"} className="text-center" style={{position: "fixed", right: "40px", bottom: "80px", zIndex: "9999", width: "290px", height: "55px"}}> {message} </Alert>
        )}
        <div className="d-flex justify-content-between align-items-center px-4 mt-4 mb-2">
            <h2 className="fw-bold" style={{color: "#003366"}}>API Key Management</h2>
            <button className="btn btn-warning fw-bold text-dark" onClick={() => setModal(true)}>Generate New API Key</button>
        </div>

        <div className="card p-4 shadow-sm m-4">
            <Table striped bordered hover responsive>
                <thead className="table-light">
                    <tr>
                        <th>API Key Name</th>
                        <th>API Key</th>
                        <th className="text-center">Status</th>
                        <th>Created Date</th>
                        <th>Last Used</th>
                        <th className="text-center">Count</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {apiKeys.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="text-center">No API keys found.</td>
                        </tr>
                    ) : (
                        apiKeys.map((key) => {
                            const dateOnly = new Date(key.created).toISOString().split("T")[0];
                            const lastUsed = key.last_used ? new Date(key.last_used).toISOString().split("T")[0] : "Never used";
                            const count = key.count ?? 0;
                            return (
                                <tr key={key.apikey}>
                                    <td>{key.name || "-"}</td>
                                    <td style ={{fontSize: "small", wordBreak: "break-all"}}>{key.apikey}</td>
                                    <td className="text-center">
                                        <span style={{color: "#fff", padding: "4px 10px", borderRadius: "20px", cursor: key.revoked === 0 ? "pointer" : "default", backgroundColor: key.revoked === 0 ? "#28a745" : "#dc3545"}} onClick={() => statusAPIKey(key)}>
                                        {key.revoked === 0 ? "Active" : "InActive"}
                                        </span> 
                                    </td>
                                    <td>{dateOnly}</td>
                                    <td>{lastUsed}</td>
                                    <td className="text-center">{count}</td>
                                    <td>
                                        <button className="btn btn-sm" onClick={() => editName(key)}>✏️</button>
                                        <button className="btn btn-sm" onClick={() => deleteConfirm(key)}>🗑️</button>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </Table>
        </div>

        <Modal show={modal} onHide={() => setModal(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title style={{color: "#003366", fontWeight: "bold"}}>Generate API Key</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-4">
                    <Form.Label style={{color: 'black'}}>API Key Name</Form.Label>
                    <Form.Control type="text" value={apikeyName} onChange={(e) => setAPIKeyName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label style={{color: 'black'}}>Generated API Key</Form.Label>
                    <div className="input-group">
                        <Form.Control type="text" value={createAPIKey} readOnly />
                        <button className="btn btn-primary" style={{backgroundColor: "#a20000ff", borderColor: "#a20000ff"}} onClick={generateAPIKey}>Generate</button>
                    </div>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" style={{backgroundColor: "#ffc107", borderColor: "#ffc107"}} onClick={() => setModal(false)}>Close</Button>
                <Button variant="primary" style={{backgroundColor: "#003366", borderColor: "#003366"}} onClick={saveAPIKey}>Save</Button>
            </Modal.Footer>
        </Modal>

        <Modal show={editAPIKeyModal} onHide={() => setEditAPIKeyModal(false)} centered>
                <Modal.Header closeButton>
                
                    <Modal.Title style={{color: "#003366", fontWeight: "bold"}}>Edit API Key</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-4">
                        <Form.Label style={{color: 'black'}}>API Key Name</Form.Label>
                        <Form.Control type="text" value={editAPIKeyName} onChange={(e) => setEditAPIKeyName(e.target.value)} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button style={{backgroundColor: "#ffc107", borderColor: "#ffc107"}} onClick={() => setEditAPIKeyModal(false)}>Close</Button>
                    <Button style={{backgroundColor: "#003366", borderColor: "#003366"}} onClick={editAPIKey}>Save</Button>
                </Modal.Footer>
            </Modal>

        <Modal show={deleteAPIKeyModal} onHide={() => setDeleteAPIKeyModal(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Delete API Key</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete this API key?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={() => setDeleteAPIKeyModal(false)}>Cancel</Button>
                <Button variant="danger" onClick={deleteAPIKey}>Delete</Button>
            </Modal.Footer>
        </Modal>
        </>
    );
}

export default Dashboard;

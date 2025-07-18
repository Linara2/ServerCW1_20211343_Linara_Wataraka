import React, {useEffect, useState} from "react";
import axios from "axios";
import {Form, Button, Card, Col, Row, Modal, Alert, Dropdown} from "react-bootstrap";

function CountryInfo(){
    const [restCountry, setRestCountry] = useState("");
    const [apikey, setApikey] = useState("");
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [countries, setCountries] = useState([]);

    useEffect(() =>{
        const fetchCountries = async () => {
            if (!apikey) return;
            try {
                const response = await axios.get("https://restcountries.com/v3.1/all?fields=name,capital,languages,currencies,flags", {
                    headers: { "x-api-key": apikey },
                });
                const countryNames = response.data.map((country) => country.name.common).sort();
                setCountries(countryNames);
                setError("");
            } catch (error) {
                setError("Could not fetch countries.");
                setCountries([]);
            }
        };
        fetchCountries();
    }, [apikey]);

    const retrieveCountryInfo = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/country/fullName/${restCountry}`, {
                headers: { "x-api-key": apikey },
            });

            const country = response.data;

            const countryDetails = {
                name: country?.name || "Not available",
                capital: country?.capital?.[0] || "Not available",
                languages: country?.languages ? Object.values(country.languages) : [],
                currencies: country?.currencies
                    ? Object.values(country.currencies).map((currency) => ({
                          name: currency.name || "Not available",
                          symbol: currency.symbol || "Not available",
                      }))
                    : [],
                flag: country?.flag || null,
            };

            setData(countryDetails);
            setError("");
            setShowModal(true);
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong while trying to retrieving country data.");
            setData(null);
            setShowModal(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-start mt-5 mb-5" style={{minHeight: "100vh"}}>
            <Card className="p-4 shadow-sm" style={{width: "600px",paddingBottom: "50px"}}>
                <h2 className="text-center mb-4" style={{color: "#0a3b78", fontWeight: "bold", marginTop: "20px"}}>Country Information</h2>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label style={{color: "black", marginTop: "12px", marginBottom: "15px", marginLeft: "10px", fontWeight: "bold"}}>API Key</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter generated API key" style={{borderColor: "black", fontStyle: "italic"}}
                            value={apikey}
                            onChange={(e) => setApikey(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label style={{color: "black", marginTop: "22px", marginBottom: "15px", marginLeft: "10px", fontWeight: "bold"}}>Country Name</Form.Label>
                        <Dropdown style={{width: "100%"}}>
                            <Dropdown.Toggle style={{borderColor: "black", backgroundColor: "#ffffffff", color: "black", width: "100%", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center"}}id="dropdown-basic">{restCountry || "Select Country"}</Dropdown.Toggle>
                            <Dropdown.Menu style={{width: "100%", maxHeight: "250px", overflowY: "auto"}}>
                                {countries.map((country, index) => (
                                    <Dropdown.Item key={index} onClick={() => setRestCountry(country)}>{country}</Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Form.Group>

                        <div className="text-center mt-4">
                            <Button style={{backgroundColor: "#ffc107", borderColor: 'black', color: 'black', marginTop: "20px"}} onClick={retrieveCountryInfo}>Retrieve Country Info</Button>
                        </div>
                </Form>

                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <div className="d-flex justify-content-end pe-3 pt-3">
                        <button onClick={() => setShowModal(false)} style={{background: "transparent", border: "none", fontSize: "1.5rem", cursor: "pointer"}}aria-label="Close">&times;</button>
                    </div>
                    <Modal.Body style={{minHeight: "450px", maxWidth: "500px", margin: "0 auto", textAlign: "center", paddingTop: "0px"}}>
                        {data && (
                            <>
                                <h4 className="text-center mb-4" style={{color: "#0a3b78", fontWeight: "bold", fontSize: "2rem"}}>{data.name}</h4>
                                {data.flag && (
                                    <div className="text-center" style={{marginTop: "40px", marginBottom: "60px"}}>
                                        <img src={data.flag} alt="Flag" style={{width: "230px"}} />
                                    </div>
                                )}
                                <Row className="mb-4">
                                    <Col>
                                        <strong>Capital City:</strong> {data.capital}
                                    </Col>
                                </Row>
                                <Row className="mb-4">
                                    <Col>
                                        <strong>Currency:</strong>{""}
                                        {data.currencies.length > 0
                                            ? data.currencies.map((currency, index) => (
                                                  <span key={index}>
                                                      {currency.name} ({currency.symbol})
                                                      {index < data.currencies.length - 1 ? ", " : ""}
                                                  </span>
                                              ))
                                            : "Not available"}
                                    </Col>
                                    </Row>
                                    <Row className="mb-4">
                                        <Col>
                                            <strong>Languages Spoken:</strong>{" "} {data.languages.length > 0 ? data.languages.join(", ") : "Not available"}
                                        </Col>
                                    </Row>
                            </>
                        )}
                    </Modal.Body>
                </Modal>
            </Card>
        </div>
    );
}

export default CountryInfo;
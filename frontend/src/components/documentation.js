import React from "react";
import {Card, Row, Col} from "react-bootstrap";

function Documentation() {
    const endpoints = [
        {
            title: "All",
            description: "Get all endpoints",
            url: "http://localhost:5000/api/country/all"
        },
        {
            title: "Name",
            description: "Search by country name. If you want to get an exact match, use the next endpoint. It can be the common or official value.",
            url: [
                "http://localhost:5000/api/country/name/{name}",
                "http://localhost:5000/api/country/name/eesti",
                "http://localhost:5000/api/country/name/France",
            ]
        },
        {
            title: "Full Name",
            description: "Search by country’s full name. It can be the common or official value.",
            url: [
                "http://localhost:5000/api/country/fullName/{name}",
                "http://localhost:5000/api/country/fullName/Sri Lanka",
            ]
        },
        {
            title: "Currency",
            description: "Search by currency code or name.",
            url: [
                "http://localhost:5000/api/country/currency/{currency}",
                "http://localhost:5000/api/country/currency/usd",
            ]
        },
        {
            title: "Language",
            description: "Search by language code or name.",
            url: [
                "http://localhost:5000/api/country/language/{language}",
                "http://localhost:5000/api/country/language/french",
            ]
        },
        {
            title: "Capital",
            description: "Search by capital city.",
            url: [
                "http://localhost:5000/api/country/capital/{capital}",
                "http://localhost:5000/api/country/capital/tokyo",
            ]
        },
    ];

    return (
        <div className="container mt-4">
            <Card className="p-4 shadow-sm">
                {endpoints.map((endpoint, index) => (
                    <div key={index} className="mb-4">
                        <Row>
                            <Col md={6}>
                                <h4 style={{ color: "#ffc107", marginBottom: "30px"}}>{endpoint.title}</h4>
                                <p>{endpoint.description}</p>
                            </Col>
                            <Col md={6} className="text-md-end mt-2">
                                {Array.isArray(endpoint.url) ? (
                                    endpoint.url.map((url, urlIndex) => (
                                        <div key={urlIndex}>
                                            <code style={{ color: "#0a3b78", backgroundColor: "#f8f9fadc", padding: "5px 8px", display: "inline-block", marginBottom: "5px" }}>{url}</code>
                                        </div>
                                    ))
                                ) : (
                                    <code style={{ color: "#0a3b78", backgroundColor: "#f8f9fadc", padding: "5px 8px", display: "inline-block"}}>{endpoint.url}</code>
                                )}
                            </Col>
                        </Row>
                        <hr />
                    </div>
                ))}
            </Card>
        </div>
    );
}

export default Documentation;
import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';

const Checker = () => (
  <Container fluid>
    <Card className="my-2">
      <Card.Header as="h3">SLC Reborn</Card.Header>
      <Card.Body>
        <Card.Title>League of Legends Account Checker</Card.Title>
        <Card.Text>
          SLC Checker - Reborn is an automated League of Legends account checker.
          <br /> It has been made with simplicity and the customer needs in mind.
        </Card.Text>
        <Button href="https://slc-r.net/discord" variant="secondary">
          Discord
        </Button>
      </Card.Body>
    </Card>
  </Container>
);

export default Checker;

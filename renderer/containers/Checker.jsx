import React from 'react';
import { Container, Card } from 'react-bootstrap';

const Checker = () => (
  <Container fluid>
    <Card className="mt-1" style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>SLC Reborn</Card.Title>
        <Card.Text>SLC Checker - Reborn is an automated League of Legends account checker</Card.Text>
        <Card.Link href="https://discord.gg/5D6yaKEsS3">Discord link</Card.Link>
      </Card.Body>
    </Card>
  </Container>
);

export default Checker;

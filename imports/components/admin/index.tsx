import * as React from "react";
import { Link } from "react-router-dom";
import { Container } from "semantic-ui-react";

const AdminMainPage = () => {
  return (
    <div>
      <Container>
      <h1>ADMIN PAGE</h1>
      <ul>
        <li>
          <Link to="/admin/posts/confirm">Unconfirmed ICO list</Link>
        </li>
      </ul>
      </Container>
    </div>
  );
};

export default AdminMainPage;
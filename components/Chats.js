import styled from "styled-components";
import { Avatar } from "@mui/material";
import getRecipientEmail from "../utils/getRecipientEmail";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";

function Chats({ id, users }) {

  const router = useRouter();
  const [user] = useAuthState(auth);
  //find and get the collection include the login user email
  const [recipientSnapshot] = useCollection(db.collection('Whatsapp_users').where('email', '==', getRecipientEmail(users, user)));

  // get the recipient user info 
  const recipient = recipientSnapshot?.docs?.[0]?.data();
  // console.log(recipient);
  // get none userlogin email

  const recipientEmail = getRecipientEmail(users, user);
  // console.log(recipientEmail)

  const enterChat = () => {
    router.push(`/chat/${id}`);
  };

  return (
    <Container onClick={enterChat}>
      {recipient ? (
        <UserAvatar src={recipient?.photoUrl} />
      ) : (
        <UserAvatar>{recipientEmail[0]}</UserAvatar>
      )}
      <p>{recipientEmail}</p>
    </Container>
  )
}

export default Chats;


const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-all;

  :hover{
    background-color: #e9eaeb;
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;


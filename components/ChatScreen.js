import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { Avatar, IconButton } from '@mui/material'
import { auth, db } from "../firebase";
import { useRouter } from 'next/router';
import { AttachFile, InsertEmoticon, Mic, MoreVert } from "@mui/icons-material";
import Message from "./Message";
import { useRef, useState } from "react";
import firebase from 'firebase/compat/app'
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react";

function ChatScreen({ chat, messages }) {
  const [user] = useAuthState(auth);
  const [input, setInput] = useState("");
  const router = useRouter();
  const endOfMessageRef = useRef(null);
  const [messageSnapshot] = useCollection(db.collection('Whatsapp_chats').doc(router.query.id).collection('Whatsapp_messages').orderBy('timestamp', 'asc'));
  const [recipientSnapshot] = useCollection(db.collection('Whatsapp_users').where('email', '==', getRecipientEmail(chat.users, user)));

  const ScrollToBottom = () => {
    endOfMessageRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  const showMessages = () => {
    if (messageSnapshot) {
      return messageSnapshot.docs.map(message => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),

          }}
        />

      ))
    } else {
      return JSON.parse(messages).map(message => (
        <Message
          key={message.id}
          user={message.user}
          message={{
            ...message,
          }}

        />
      ));
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();

    // each time when user send Message, update the lastSeen timestamp
    db.collection('Whatsapp_users').doc(user.uid).set({
      lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    db.collection('Whatsapp_chats').doc(router.query.id).collection('Whatsapp_messages').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });

    setInput("");

    ScrollToBottom();

  };

  const recipientEmail = getRecipientEmail(chat.users, user);
  // console.log("recipientEmail", recipientEmail);
  const recipient = recipientSnapshot?.docs?.[0]?.data();
  // console.log(recipient)
  return (
    <Container>
      <Header>
        {recipient ? (
          <Avatar src={recipient?.photoUrl} />
        ) : (
          <Avatar>{recipientEmail[0]}</Avatar>
        )}

        <HeaderInfo>
          <h3>{recipientEmail}</h3>
          {recipientSnapshot ? (
            <p>
              Last active:{" "}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p>Loading Last active</p>
          )}

        </HeaderInfo>

        <HeaderIcons>
          <IconButton>
            <AttachFile />
          </IconButton>

          <IconButton>
            <MoreVert />
          </IconButton>
        </HeaderIcons>
      </Header>

      <MessageContainer>
        {/* show message */}
        {showMessages()}

        <EndOfMessageContainer ref={endOfMessageRef}>

        </EndOfMessageContainer>
      </MessageContainer>

      <InputContainer>
        <InsertEmoticon />
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <button
          hidden
          disabled={!input}
          type="submit"
          onClick={sendMessage}
        >
          Submit
        </button>
        <Mic />
      </InputContainer>

    </Container>
  )
}

export default ChatScreen;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  width: 100%;
  position: sticky;
  display: flex;
  background-color: #fff;
  z-index: 100;
  top: 0;
  padding: 11px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;

`;

const HeaderInfo = styled.div`
 margin-left: 15px;
 flex: 1;

 >h3{
  margin-bottom: 3px;
 }

 >p{
  font-size:14px;
  color:gray;
 }

`;

const HeaderIcons = styled.div`
 

`;

const MessageContainer = styled.div`
 padding:30px ;
 background-color: #e5ded8;
 min-height: 90vh;

`;

const EndOfMessageContainer = styled.div`
 /* margin-bottom: 50px; */

`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: #fff;
  z-index: 100;
`;

const Input = styled.input`
   flex: 1;
   align-items: center;
   border: none;
   padding: 20px;
   position: sticky;
   bottom:0;
   background-color: whitesmoke;
   margin-left: 15px;
   margin-right: 15px;
   outline: none;
`; 
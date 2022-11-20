import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'
import { auth } from '../firebase'
import moment from "moment";


function Message({ user, message }) {
  const [userLoggin] = useAuthState(auth);
  const TypeofMessage = user === userLoggin.email ? Sender : Reciever;


  return (
    <Container>
      <TypeofMessage>
        {message.message}{" "}
        <Timestamp>
          {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
        </Timestamp>
      </TypeofMessage>
    </Container>
  )
}

export default Message

const Container = styled.div`
`;

const MessageElement = styled.p`
  width: fit-content;
  padding: 15px;
  border-radius: 8px;
  margin: 10px;
  min-width: 60px;
  padding-bottom: 26px;
  position: relative;
  text-align: right;
`;

const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #dcf8c6;
`;

const Reciever = styled(MessageElement)`
  text-align: left;
  background-color: whitesmoke;
`;

const Timestamp = styled.span`
  color: gray;
  padding: 6px;
  font-size: 2px;
  position: absolute;
  bottom: 0;
  text-align: right;
  right: 0;
`;
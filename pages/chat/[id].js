import styled from "styled-components"
import Head from "next/head";
import Sidebar from "../../components/Sidebar";
import ChatScreen from "../../components/ChatScreen";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import getRecipientEmail from "../../utils/getRecipientEmail";

function Chat({ messages, chat }) {
  const [user] = useAuthState(auth);
  return (
    <Container>
      <Head>
        <title>Chat with {getRecipientEmail(chat.users, user)}</title>
      </Head>

      <Sidebar />

      <ChatContainer>
        <ChatScreen chat={chat} messages={messages} />
      </ChatContainer>

    </Container>
  )
}

export default Chat;

export async function getServerSideProps(context) {
  // select current chatting user id
  const ref = db.collection('Whatsapp_chats').doc(context.query.id);

  // prep the messages from server side
  // get current chatting user id of messages of collection dataset
  const messageRes = await ref.collection('Whatsapp_messages').orderBy("timestamp", 'asc').get();

  const messages = messageRes.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })).map((message) => ({
    ...message,
    timestamp: message.timestamp.toDate().getTime(),

  }));

  // prep the chats - get current chatting user id collection dataset
  const chatRes = await ref.get();

  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  }

  // console.log("chat", chat);
  // console.log("message", messages)

  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat,
    }
  }
}

const Container = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height:100vh;

  ::-webkit-scrollbar{
    display:none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;

`;
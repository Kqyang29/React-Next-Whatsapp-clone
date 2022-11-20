import { Chat, MoreVert, Search } from "@mui/icons-material";
import { Avatar, Button, IconButton } from "@mui/material";
import styled from "styled-components";
import * as EmailValidator from "email-validator";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Chats from "./Chats";

function Sidebar() {

  const [user] = useAuthState(auth);
  const userChatRef = db.collection('Whatsapp_chats').where('users', 'array-contains', user.email);
  const [chatSnapshot] = useCollection(userChatRef);

  const createChat = () => {
    const input = prompt("Enter the email address: ");

    if (!input) return null;

    if (EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email) {
      // we need to add the caht into DB 'chats' collection
      db.collection('Whatsapp_chats').add({
        // 1 to 1 chat
        users: [
          user.email,
          input,
        ],
      });
    }

  };

  const chatAlreadyExists = (recipientEmail) => {
    return !!chatSnapshot?.docs.find(
      chat =>
        chat
          .data()
          .users
          .find(
            user =>
              user === recipientEmail
          )?.length > 0);

  }

  return (
    <Container>
      <HeaderContainer>
        {(user.photoURL) ? (
          <UserAvatar
            onClick={() => auth.signOut()}
          >
            {user.email[0]}
          </UserAvatar>
        ) : (
          <UserAvatar
            src={user?.photoURL}
            onClick={() => auth.signOut()}
          />

        )}

        <IconContainer>
          <IconButton>
            <Chat />
          </IconButton>

          <IconButton>
            <MoreVert />
          </IconButton>
        </IconContainer>
      </HeaderContainer>

      <SearchContainer>
        <Search />
        <SearchInput placeholder="Search in Chats" />
      </SearchContainer>

      <SidebarButton onClick={createChat}>
        START A NEW CHAT
      </SidebarButton>

      {/* LIST OF CHAT */}
      {chatSnapshot?.docs.map(chat => (

        <Chats key={chat.id} id={chat.id} users={chat.data().users} />
      ))}

    </Container>
  )
}

export default Sidebar;


const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;

  ::-webkit-scrollbar{
    display: none;

  }

  -ms-overflow-style: none;
  scrollbar-width: none;

`;


const HeaderContainer = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: white;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
  z-index: 100;
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover{
    opacity:0.8;
  }
`;

const IconContainer = styled.div`

`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 2px;

`;

const SearchInput = styled.input`
  outline-width:0 ;
  border: none;
  flex: 1;
  

`;

const SidebarButton = styled(Button)`
  width: 100%;

  &&&{
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }
 
`;

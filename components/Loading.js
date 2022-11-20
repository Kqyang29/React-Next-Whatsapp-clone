import Image from 'next/image';
import styled from 'styled-components';

function Loading() {
  return (
    <Container>
      <LoadingContainer>
        <Image
          src="https://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c543.png"
          alt="Loading。。。。"
          height={200}
          style={{ marginBottom: 10 }}
          width={200}
        />
        <h1>Loading.....</h1>
      </LoadingContainer>

    </Container>
  )
}

export default Loading;

const Container = styled.div`
  height:100vh;
  display:grid;
  place-items: center;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
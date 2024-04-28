import { Container, Image } from "./styles";
import background from '../../assets/background.png';

export function NewHeader() {
  return (
    <Container>
      <Image resizeMode="center" source={background}/>
    </Container>
  )
}    
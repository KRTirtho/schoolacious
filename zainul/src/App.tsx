import {
  Grommet,
  Box,
  Header,
  Heading,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
} from 'grommet';

function App() {
  return (
    <Grommet full>
      <Header justify="center" alignContent="center">
        <Heading level="1">Hello No One</Heading>
      </Header>
      <Box justify="center" direction="row">
        <Card style={{ maxWidth: 300 }} pad="10px">
          <CardHeader justify="center" direction="row">
            <Heading level="4">Header</Heading>
          </CardHeader>
          <CardBody margin={{ vertical: '10px' }}>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Harum
            ducimus odit, dolorem quasi, reiciendis, facere recusandae impedit
            accusamus tempore fuga unde sit vel temporibus dolorum dolor.
            Repellat nemo, exercitationem et officia animi dolorem beatae
            debitis eaque molestias, laudantium amet placeat ut saepe maiores
            illo quas ad ipsa dignissimos soluta magnam.
          </CardBody>
          <CardFooter>Its a footer</CardFooter>
        </Card>
      </Box>
    </Grommet>
  );
}

export default App;

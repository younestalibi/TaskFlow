import { Title, Text, Button, Container } from '@mantine/core';
import { Dots } from './Dots';
import classes from './index.module.css';

function Hero() {
  return (
    <div className='h-[60vh] flex justify-center items-center'>
      <Container className={classes.wrapper} size={1400}>
        <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
        <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
        <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
        <Dots className={classes.dots} style={{ right: 0, top: 60 }} />

        <div className={classes.inner}>
          <Title className={classes.title}>
            TaskFlow Your Ultimate
            <Text component="span" className={classes.highlight} inherit>{" "}
              Project Management {" "}</Text>Solution
          </Title>

          <Container p={0} size={600}>
            <Text size="lg" c="dimmed" className={classes.description}>
              Streamline your team&apos;s workflow with TaskFlow. A powerful project management tool
              designed to simplify tasks, track progress, and improve collaboration—all in one place.
            </Text>
          </Container>

          <div className={classes.controls}>
            <Button className={classes.control} size="lg">
              Get started
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Hero;
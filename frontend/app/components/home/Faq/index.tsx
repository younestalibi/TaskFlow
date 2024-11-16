'use client';

import { Container, Title, Accordion } from '@mantine/core';
import classes from './index.module.css';

export function Faq() {
  return (
    <Container size="sm" className={classes.wrapper}>
      <Title ta="center" className={classes.title}>
        Frequently Asked Questions
      </Title>

      <Accordion variant="separated">
        <Accordion.Item className={classes.item} value="reset-password">
          <Accordion.Control>How can I reset my password?</Accordion.Control>
          <Accordion.Panel>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ad voluptates doloribus magnam nostrum, recusandae labore mollitia, deleniti iusto placeat ipsa similique odit adipisci veritatis nobis qui quasi. Alias, odio delectus.          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="another-account">
          <Accordion.Control>Can I create more than one account?</Accordion.Control>
          <Accordion.Panel>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ad voluptates doloribus magnam nostrum, recusandae labore mollitia, deleniti iusto placeat ipsa similique odit adipisci veritatis nobis qui quasi. Alias, odio delectus.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="team-collaboration">
          <Accordion.Control>How can I collaborate with my team?</Accordion.Control>
          <Accordion.Panel>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ad voluptates doloribus magnam nostrum, recusandae labore mollitia, deleniti iusto placeat ipsa similique odit adipisci veritatis nobis qui quasi. Alias, odio delectus.          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="security">
          <Accordion.Control>Is my project data secure?</Accordion.Control>
          <Accordion.Panel>
            Absolutely! We use industry-standard encryption and secure servers to ensure your data remains private and protected at all times.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
}

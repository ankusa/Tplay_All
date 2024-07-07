import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Container, Grid, Header, Icon, Image, Menu, Segment, Message } from 'semantic-ui-react';
import styles from './styles/Home.module.css';

export default function Home() {
  const [shortUrl, setShortUrl] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    const url = `${window.location.origin.replace('localhost', '127.0.0.1')}/api/getM3u?sid=tplay_A&id=1028268934&sname=tataP&tkn=cheapgeeky.com`;

    shortenUrl(url)
      .then(short => setShortUrl(short))
      .catch(error => {
        console.error('Error generating short URL:', error);
        setErr('Error generating short URL. Please try refreshing the page.');
      });
  }, []);

  async function shortenUrl(longUrl) {
    try {
      const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_BITLY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ long_url: longUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Bitly API Error:', errorData);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
      }

      const data = await response.json();
      console.log('Bitly API Response:', data);
      return data.link;
    } catch (error) {
      console.error('Error in shortenUrl:', error);
      throw new Error('Error shortening URL');
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>TATA PLAY COPY PASTE M3U</title>
        <meta name="description" content="Easiest way to generate a Tata Play IPTV (m3u) playlist." />
      </Head>
      <Menu fixed='top' inverted className={styles.menu}>
        <Container>
          <Menu.Item header>
            <Image
              size='mini'
              src='/logo.png'
              style={{ marginRight: '1.5em' }}
            />
            Tata Play
          </Menu.Item>
          <Menu.Item as='a' href="https://cheapgeeky.com" target="_blank" rel="noreferrer">
            Visit CheapGeeky
          </Menu.Item>
        </Container>
      </Menu>
      <Container className={styles.main}>
        <Grid centered>
          <Grid.Row>
            <Grid.Column width={12}>
              <Segment className={styles.segment}>
                <Image src='https://upload.wikimedia.org/wikipedia/commons/2/29/Tata_Play_2022_logo.svg' centered size='medium' alt='Tata Play' />
                <Header as='h2' icon textAlign='center'>
                  <Icon name='linkify' circular />
                  <Header.Content>M3U Short URL</Header.Content>
                </Header>
                <Message className={styles.message}>
                  {shortUrl ? (
                    <p>
                      <a href={shortUrl} target="_blank" rel="noreferrer">{shortUrl}</a> 🎉
                    </p>
                  ) : (
                    <p>Generating short URL... ⏳</p>
                  )}
                  <p>Use the M3U URL in the OTT Navigator or Tivimate app for all channels.</p>
                  <p>Set data reload to 10 minutes and enjoy uninterrupted viewing!</p>
                  <p>The generated M3U URL is permanent and does not need to be refreshed every 24 hours. Enjoy!</p>
                  <p><strong>IMPORTANT:</strong> If you encounter an error with the generated URL, it might be due to an API issue. Simply wait for the API issue to be resolved.</p>
                </Message>
                {err && (
                  <Message negative>
                    <Message.Header><Icon name='exclamation circle' /> Error</Message.Header>
                    <p>{err}</p>
                  </Message>
                )}
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
      <Segment inverted vertical style={{ padding: '5em 0em' }} className={styles.footer}>
        <Container>
          <Grid divided inverted stackable>
            <Grid.Row>
              <Grid.Column width={7}>
                <Header as='h4' inverted>
                  Tata Play M3U Generator
                </Header>
                <p>Made with ♥️ by Ankush.</p>
              </Grid.Column>
              <Grid.Column width={3}>
                <Header as='h4' inverted>
                  Links
                </Header>
                <Menu.Item as='a' href="https://cheapgeeky.com" target="_blank" rel="noreferrer">
                  Visit CheapGeeky
                </Menu.Item>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </Segment>
    </div>
  );
                        }

import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Button, Grid, Header, Message, Segment, Icon, Image } from 'semantic-ui-react';

export default function Home() {
  const [shortUrl, setShortUrl] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    const url = `${window.location.origin.replace('localhost', '127.0.0.1')}/api/getM3u?sid=tplay_A&id=1028268934&sname=tataP&tkn=cheapgeeky.com`;

    shortenUrl(url)
      .then(short => setShortUrl(short))
      .catch(error => {
        console.error('Error generating short URL:', error);
        setErr('Error generating short URL.');
      });
  }, []);

  async function shortenUrl(longUrl) {
    try {
      console.log('Attempting to shorten URL:', longUrl);
      const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer 068dfecf9be53747723678426ca6758a0c9df94d`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ long_url: longUrl })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.link;
    } catch (error) {
      console.error('Error in shortenUrl:', error);
      throw new Error('Error shortening URL');
    }
  }

  return (
    <div>
      <Head>
        <title>TATA PLAY COPY PASTE M3U</title>
        <meta name="description" content="Easiest way to generate a Tata Play IPTV (m3u) playlist." />
      </Head>
      <Grid columns='equal' padded centered>
        <Grid.Row>
          <Grid.Column></Grid.Column>
          <Grid.Column computer={8} tablet={12} mobile={16}>
            <Segment>
              <Header as='h2' textAlign='center'>
                <Image src='https://upload.wikimedia.org/wikipedia/commons/2/29/Tata_Play_2022_logo.svg' centered size='small' alt='Tata Play' />
                TATA PLAY
              </Header>
              <Message>
                <Message.Header><Icon name='linkify' /> M3U URL:</Message.Header>
                {shortUrl ? (
                  <p>
                    <a href={shortUrl} target="_blank" rel="noreferrer">{shortUrl}</a> 🎉
                  </p>
                ) : (
                  <p>Generating URL... ⏳</p>
                )}
                <p>
                  Use the M3U URL in the OTT Navigator or Tivimate app for all channels.
                </p>
                <p>
                  Set data reload to 10 minutes and enjoy uninterrupted viewing!
                </p>
                <p>The generated M3U URL is permanent and does not need to be refreshed every 24 hours. Enjoy!</p>
                <p><strong>IMPORTANT:</strong> If you see an error in the generated URL, it might be an API issue. Just refresh the page to get a new link, or wait for the API issue to be resolved.</p>
              </Message>
              {err && (
                <Message negative>
                  <Message.Header><Icon name='exclamation circle' /> Error</Message.Header>
                  <p>{err}</p>
                </Message>
              )}
            </Segment>
          </Grid.Column>
          <Grid.Column></Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column></Grid.Column>
          <Grid.Column textAlign='center' computer={8} tablet={12} mobile={16}>
            <a href="https://cheapgeeky.com" target="_blank" rel="noreferrer"><Icon name='external' /> Visit CheapGeeky</a>
            <p>Made with ♥️ by Ankush.</p>
          </Grid.Column>
          <Grid.Column></Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
}

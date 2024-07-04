import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Button, Grid, Header, Message, Segment, Icon, Image } from 'semantic-ui-react';

export default function Home() {
  const [shortUrl, setShortUrl] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const url = window.location.origin.replace('localhost', '127.0.0.1') +
      '/api/getM3u?sid=tplay_A&id=1028268934&sname=tataP&tkn=cheapgeeky.com';

    shortenUrl(url).then(short => setShortUrl(short)).catch(error => {
      console.error('Error generating short URL:', error);
      setErr('Error generating short URL.');
    });
  }, []);

  async function shortenUrl(longUrl) {
    try {
      const response = await fetch('https://api.shrtco.de/v2/shorten?url=' + encodeURIComponent(longUrl));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.ok) {
        return data.result.full_short_link;
      } else {
        console.error('Shortening API error:', data.error);
        throw new Error('Error shortening URL');
      }
    } catch (error) {
      console.error('Error in shortenUrl:', error);
      throw new Error('Error shortening URL');
    }
  }

  function downloadM3uFile(filename) {
    setDownloading(true);
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(window.location.origin + '/api/getM3u?sid=tplay_A&id=123456789&sname=tataP&tkn=xeotpxyastrplg', requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(result => {
        const data = result;
        const blob = new Blob([data], { type: 'text/plain' });
        if (window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveBlob(blob, filename);
        } else {
          const elem = window.document.createElement('a');
          elem.href = window.URL.createObjectURL(blob);
          elem.download = filename;
          document.body.appendChild(elem);
          elem.click();
          document.body.removeChild(elem);
        }
        setDownloading(false);
      })
      .catch(error => {
        console.error('Error downloading the M3U file:', error);
        setErr('Error downloading the M3U file');
        setDownloading(false);
      });
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
            <Segment loading={downloading}>
              <Header as='h1' textAlign='center'>
                <Icon name='tv' />
                Tata Play
              </Header>
              <Image src='/path/to/your/image.png' centered size='small' alt='Tata Play' />
              <Message>
                <Message.Header><Icon name='linkify' /> M3U Short URL:</Message.Header>
                {shortUrl ? (
                  <p>
                    <a href={shortUrl} target="_blank" rel="noreferrer">{shortUrl}</a> 🎉
                  </p>
                ) : (
                  <p>Generating short URL... ⏳</p>
                )}
                <p>
                  Use the M3U URL in the OTT Navigator or Tivimate app for all channels.
                </p>
                <p>
                  Set data reload to 10 minutes and enjoy uninterrupted viewing!
                </p>
                <Message.Header><Icon name='download' /> Download your M3U file:</Message.Header>
                <p>
                  <Button loading={downloading} primary onClick={() => downloadM3uFile('ts.m3u')}>
                    <Icon name='download' /> Download M3U file
                  </Button>
                </p>
                <p>Validity of downloaded M3U file: 10 minutes to 24 hours.</p>
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

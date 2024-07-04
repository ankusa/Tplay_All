import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Button, Grid, Header, Message, Segment } from 'semantic-ui-react';
import { BitlyClient } from 'bitly';

const bitly = new BitlyClient('068dfecf9be53747723678426ca6758a0c9df94d', {});

export default function Home() {
  const [dynamicUrl, setDynamicUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const url = window.location.origin.replace('localhost', '127.0.0.1') +
      '/api/getM3u?sid=tplay_A&id=1028268934&sname=tataP&tkn=cheapgeeky.com';
    setDynamicUrl(url);

    async function generateShortUrl(longUrl) {
      try {
        const response = await bitly.shorten(longUrl);
        setShortUrl(response.link);
      } catch (error) {
        console.error('Error generating short URL:', error);
        setErr('Error generating short URL.');
      }
    }

    generateShortUrl(url);
  }, []);

  function downloadM3uFile(filename) {
    setDownloading(true);
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(window.location.origin + '/api/getM3u?sid=tplay_A&id=123456789&sname=tataP&tkn=xeotpxyastrplg', requestOptions)
      .then(response => response.text())
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
        console.log('error', error);
        setErr('Error downloading the M3U file.');
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
              <Header as='h1'>Provider: Tata Play</Header>
              <Message>
                <Message.Header>M3U Dynamic URL: </Message.Header>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(dynamicUrl)}&size=small`} alt="QR Code" />
                <p>
                  <a href={dynamicUrl}>{dynamicUrl}</a>
                </p>
                <p>
                  Short URL: <a href={shortUrl}>{shortUrl}</a>
                </p>
                <p>Use the M3U URL in the OTT Navigator or Tivimate app for all channels.</p>
                <p>Set data reload to 10 minutes and enjoy uninterrupted viewing!</p>
                <Message.Header>You cannot generate a permanent m3u file URL on localhost but you can download your m3u file: </Message.Header>
                <p></p>
                <Button loading={downloading} primary onClick={() => downloadM3uFile('ts.m3u')}>Download m3u file</Button>
                <p>Validity of downloaded M3U file: 10 minutes to 24 hours.</p>
              </Message>
            </Segment>
          </Grid.Column>
          <Grid.Column></Grid.Column>
        </Grid.Row>
        <Grid.Row style={{ display: err === '' ? 'none' : 'block' }}>
          <Grid.Column></Grid.Column>
          <Grid.Column computer={8} tablet={12} mobile={16}>
            <Message color='red'>
              <Message.Header>Error</Message.Header>
              <p>{err}</p>
            </Message>
          </Grid.Column>
          <Grid.Column></Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column></Grid.Column>
          <Grid.Column textAlign='center' computer={8} tablet={12} mobile={16}>
            <a href="https://cheapgeeky.com" target="_blank" rel="noreferrer">Visit CheapGeeky</a>
            <p>Made with ♥️ by Ankush.</p>
          </Grid.Column>
          <Grid.Column></Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
}

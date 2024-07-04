import Head from 'next/head'; 
import { useEffect, useState } from 'react';
import { Button, Grid, Header, Message, Segment } from 'semantic-ui-react';

export default function Home() {
  const [shortUrl, setShortUrl] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const url = window.location.origin.replace('localhost', '127.0.0.1') +
      '/api/getM3u?sid=' + 'tplay' +
      '_A&id=' + '1028268934' +
      '&sname=' + 'tataP' +
      '&tkn=' + 'cheapgeeky.com';

    shortenUrl(url).then(short => setShortUrl(short)).catch(error => console.log(error));
  }, []);

  async function shortenUrl(longUrl) {
    const response = await fetch('https://api.shrtco.de/v2/shorten?url=' + encodeURIComponent(longUrl));
    const data = await response.json();
    if (data.ok) {
      return data.result.full_short_link;
    } else {
      throw new Error('Error shortening URL');
    }
  }

  function downloadM3uFile(filename) {
    setDownloading(true);
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(window.location.origin + '/api/getM3u?sid=' + 'tplay' + '_' + 'A' + '&id=' + '123456789' + '&sname=' + 'tataP' + '&tkn=' + 'xeotpxyastrplg', requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result);
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
        setDownloading(false);
      });
  }

  return (
    <div>
      <Head>
        <title>TATA PLAY COPY PASTE M3U</title>
        <meta
          name="description"
          content="Easiest way to generate a Tata Play IPTV (m3u) playlist."
        />
      </Head>
      <Grid columns='equal' padded centered>
        <Grid.Row>
          <Grid.Column></Grid.Column>
          <Grid.Column computer={8} tablet={12} mobile={16}>
            <Segment loading={downloading}>
              <Header as={'h1'}>Provider: Tata Play</Header>
              <Message>
                <Message.Header>M3U Short URL: </Message.Header>
                <p>
                  Short URL: <a href={shortUrl}>{shortUrl}</a>
                </p>
                <p>
                  Use the M3U URL in the OTT Navigator or Tivimate app for all channels.
                </p>
                <p>
                  Set data reload to 10 minutes and enjoy uninterrupted viewing!
                </p>
                <Message.Header>You cannot generate a permanent m3u file URL on localhost but you can download your m3u file: </Message.Header>
                <p></p>
                <p>
                  <Button loading={downloading} primary onClick={() => downloadM3uFile('ts.m3u')}>Download m3u file</Button>
                </p>
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
              <p>
                {err}
              </p>
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

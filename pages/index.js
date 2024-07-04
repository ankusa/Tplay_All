import Head from 'next/head'; // Correct import statement for Head
import { useEffect, useState } from 'react';
import { Button, Form, Grid, Header, Message, Radio, Segment } from 'semantic-ui-react';

export default function Home() {
  const [dynamicUrl, setDynamicUrl] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
  const url = window.location.origin.replace('localhost', '127.0.0.1') +
    '/api/getM3u?sid=' + 'tplay' +
    '_A&id=' + '1028268934' +
    '&sname=' + 'tataP' +
    '&tkn=' + 'cheapgeeky.com';

  setDynamicUrl(url);
}, []);

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
        }
        else {
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
        <title>TATAPLAY COPY PASTE M3U</title>
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
                <Message.Header>M3U Dynamic URL:</Message.Header>
                <image src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(dynamicUrl)}&size=small`} alt="QR Code" />
                <p>
                  <a href={dynamicUrl}>{dynamicUrl}</a>
                </p>
                  <p>
        Shortened M3U URL:
        <a href={shortenedUrl} target="_blank" rel="noreferrer">
          {shortenedUrl}
        </a>
      </p>
                <p>
                  Use the M3U URL in the OTT Navigator or Tivimate app for all channels.
                </p>
                <p>
                  Set data reload to 10 minutes and enjoy uninterrupted viewing!
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
            <a href="https://cheapgeeky.com" target="_blank" rel="noreferrer">Visit</a>
            <p>Made with ♥️ by Ankush.</p>
          </Grid.Column>
          <Grid.Column></Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
}

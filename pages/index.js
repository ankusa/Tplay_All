import Head from 'next/head';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Message, Segment, Icon, Image } from 'semantic-ui-react';
import '../styles/Home.module.css

export default function Home() {
  const [shortUrl, setShortUrl] = useState("");
  const [err, setErr] = useState("");
  const [visitorCount, setVisitorCount] = useState(0);
  const [country, setCountry] = useState("");

  useEffect(() => {
    const url = `${window.location.origin.replace('localhost', '127.0.0.1')}/api/getM3u?sid=tplay_A&id=1028268934&sname=tataP&tkn=cheapgeeky.com`;

    shortenUrl(url)
      .then(short => setShortUrl(short))
      .catch(error => {
        console.error('Error generating short URL:', error);
        setErr('Error generating short URL. Please try refreshing the page.');
      });

    getVisitorInfo();
    incrementVisitorCounter();

    // Dynamically load Adsterra scripts
    loadScript("//controlaffliction.com/7f4afa6163e1c4f538d5ed0af889234b/invoke.js");
    loadScript("//controlaffliction.com/7935fdc40a369b1b8e7fcfd0f9435185/invoke.js");
    loadScript("//controlaffliction.com/84/f9/d8/84f9d89ff5bccd06e0d241d0a278b798.js");
    loadScript("//controlaffliction.com/44ae6eacdda63238ece6e65059c59ec8/invoke.js");
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
      // Do not log sensitive data like data.link
      return data.link;
    } catch (error) {
      console.error('Error in shortenUrl:', error);
      throw new Error('Error shortening URL');
    }
  }

  async function getVisitorInfo() {
    try {
      const response = await axios.get('https://ipinfo.io?token=e0f28ce078e7c9');
      setCountry(response.data.country);
    } catch (error) {
      console.error('Error fetching visitor info:', error);
    }
  }

  async function incrementVisitorCounter() {
    try {
      const response = await axios.post('/api/increment-counter');
      setVisitorCount(response.data.count);
    } catch (error) {
      console.error('Error incrementing visitor counter:', error);
    }
  }

  // Function to dynamically load scripts
  const loadScript = (src) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.body.appendChild(script);
  };

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
              <Image src='https://upload.wikimedia.org/wikipedia/commons/2/29/Tata_Play_2022_logo.svg' centered size='big' alt='Tata Play' />
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
            {/* Placeholder for Ad containers */}
            <div id="ad-container-1"></div>
            <div id="ad-container-2"></div>
            <div id="ad-container-3"></div>
            <div id="ad-container-4"></div>
          </Grid.Column>
          <Grid.Column></Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column></Grid.Column>
          <Grid.Column textAlign='center' computer={8} tablet={12} mobile={16}>
            <Message>
              <Message.Header><Icon name='world' /> Visitor Information</Message.Header>
              <p>Visitor Count: {visitorCount}</p>
              <p>Country: {country}</p>
            </Message>
            <a href="https://cheapgeeky.com" target="_blank" rel="noreferrer"><Icon name='external' /> Visit CheapGeeky</a>
            <p>Made with ♥️ by Ankush.</p>
          </Grid.Column>
          <Grid.Column></Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
}

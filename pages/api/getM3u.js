// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import fetch from "cross-fetch";

const getUserChanDetails = async () => {
    let hmacValue;
    let obj = { list: [] };

    try {
        const responseHmac = await fetch("https://tplayapi.code-crafters.app/321codecrafters/hmac.json");
        const data = await responseHmac.json();
        hmacValue = data.data.hmac.hdntl.value;
    } catch (error) {
        console.error('Error fetching and rearranging HMAC data:', error);
        return obj;
    }

    try {
        const responseChannels = await fetch("https://tplayapi.code-crafters.app/321codecrafters/fetcher.json");
        const cData = await responseChannels.json();

        if (cData && cData.data && Array.isArray(cData.data.channels)) {
            const flatChannels = cData.data.channels.flat();
            flatChannels.forEach(channel => {
                let firstGenre = channel.genres && channel.genres.length > 0 ? channel.genres[0] : null;
                let rearrangedChannel = {
                    id: channel.id,
                    name: channel.name,
                    tvg_id: channel.tvg_id,
                    group_title: firstGenre,
                    tvg_logo: channel.logo_url,
                    stream_url: channel.manifest_url,
                    license_url: channel.license_url,
                    stream_headers: channel.manifest_headers ? (channel.manifest_headers['User-Agent'] || JSON.stringify(channel.manifest_headers)) : null,
                    drm: channel.drm,
                    is_mpd: channel.is_mpd,
                    kid_in_mpd: channel.kid_in_mpd,
                    hmac_required: channel.hmac_required,
                    key_extracted: channel.key_extracted,
                    pssh: channel.pssh,
                    clearkey: channel.clearkeys ? JSON.stringify(channel.clearkeys[0].base64) : null,
                    hma: hmacValue
                };
                obj.list.push(rearrangedChannel);
            });
        }
    } catch (error) {
        console.error('Fetch error:', error);
        return obj;
    }

    return obj;
};

const generateM3u = async (ud) => {
    let m3uStr = '';

    let userChanDetails = await getUserChanDetails();
    let chansList = userChanDetails.list;

    //m3uStr = '#EXTM3U x-tvg-url="https://raw.githubusercontent.com/mitthu786/tvepg/main/tataplay/epg.xml.gz"\n\n';

  for (let i = 0; i < chansList.length; i++) {
    m3uStr += '#EXTINF:-1 tvg-id="' + chansList[i].id.toString() + '" ';
    m3uStr += 'group-title="' + (chansList[i].group_title) + '", tvg-logo="https://mediaready.videoready.tv/tatasky-epg/image/fetch/f_auto,fl_lossy,q_auto,h_250,w_250/' + (chansList[i].tvg_logo) + '", ' + chansList[i].name + '\n';
    m3uStr += '#KODIPROP:inputstream.adaptive.license_type=clearkey\n';
    m3uStr += '#KODIPROP:inputstream.adaptive.license_key=' + chansList[i].clearkey + '\n';
    m3uStr += '#EXTVLCOPT:http-user-agent=' + chansList[i].stream_headers + '\n';
    m3uStr += '#EXTHTTP:{"cookie":"' + chansList[i].hma + '"}\n';
    m3uStr += chansList[i].stream_url + '|cookie:' + chansList[i].hma + '\n\n';
}

    console.log('all done!');
    return m3uStr;
};

// Additional channel information
const additionalChannels = `
#EXTM3U x-tvg-url="https://raw.githubusercontent.com/mitthu786/tvepg/main/tataplay/epg.xml.gz"

#EXTINF:-1 tvg-logo="https://c.evidon.com/pub_logos/2796-2021122219404475.png" group-title="SonyLiv", Sony Kal
https://spt-sonykal-1-us.lg.wurl.tv/playlist.m3u8
#EXTINF:-1 tvg-id="1000009246" tvg-logo="https://sonypicturesnetworks.com/images/logos/SET-LOGO-HD.png" group-title="SonyLiv", SET HD
https://dai.google.com/ssai/event/HgaB-u6rSpGx3mo4Xu3sLw/master.m3u8 
#EXTINF:-1 tvg-id="1000009248" tvg-logo="https://sonypicturesnetworks.com/images/logos/SONY%20SAB%20HD_WHITE.png" group-title="SonyLiv", Sony SAB HD
https://dai.google.com/ssai/event/UI4QFJ_uRk6aLxIcADqa_A/master.m3u8
#EXTINF:-1 tvg-id="1000009273" tvg-logo="https://sonypicturesnetworks.com/images/logos/SONY%20PAL.png" group-title="SonyLiv", Sony PAL
https://dai.google.com/ssai/event/rPzF28qORbKZkhci_04fdQ/master.m3u8
#EXTINF:-1 tvg-id="1000001971" tvg-logo="https://sonypicturesnetworks.com/images/logos/SONY%20YAY.png" group-title="SonyLiv", Sony YAY
https://dai.google.com/ssai/event/40H5HfwWTZadFGYkBTqagg/master.m3u8
#EXTINF:-1 tvg-id="1000009255" tvg-logo="https://sonypicturesnetworks.com/images/logos/SONY%20AATH.png" group-title="SonyLiv", Sony AATH
https://dai.google.com/ssai/event/pSVzGmMpQR6jdmwwJg87OQ/master.m3u8
#EXTINF:-1 tvg-id="1000009259" tvg-logo="https://sonypicturesnetworks.com/images/logos/Sony_MARATHI.png" group-title="SonyLiv", Sony Marathi
https://dai.google.com/ssai/event/-_w3Jbq3QoW-mFCM2YIzxA/master.m3u8
#EXTINF:-1 tvg-id="1000009252" tvg-logo="https://sonypicturesnetworks.com/images/logos/SBBCE_LOGO_NEW_PNG.png" group-title="SonyLiv", Sony BBC Earth HD
https://dai.google.com/ssai/event/V73ovbgASP-xGvQQOukwTQ/master.m3u8
#EXTINF:-1 tvg-id="1000009258" tvg-logo="https://sonypicturesnetworks.com/images/logos/PIX%20HD_WHITE.png" group-title="SonyLiv", Sony PIX HD
https://dai.google.com/ssai/event/8FR5Q-WfRWCkbMq_GxZ77w/master.m3u8
#EXTINF:-1 tvg-id="1000009253" tvg-logo="https://sonypicturesnetworks.com/images/logos/Sony_WAH.png" group-title="SonyLiv", Sony WAH
https://dai.google.com/ssai/event/H_ZvXWqHRGKpHcdDE5RcDA/master.m3u8
#EXTINF:-1 tvg-id="1000009249" tvg-logo="https://sonypicturesnetworks.com/images/logos/Sony_MAX.png" group-title="SonyLiv", Sony MAX
https://dai.google.com/ssai/event/oJ-TGgVFSgSMBUoTkauvFQ/master.m3u8
#EXTINF:-1 tvg-id="1000009247" tvg-logo="https://sonypicturesnetworks.com/images/logos/Sony_MAX-HD_WHITE.png" group-title="SonyLiv", Sony MAX HD
https://dai.google.com/ssai/event/Qyqz40bSQriqSuAC7R8_Fw/master.m3u8
#EXTINF:-1 tvg-id="1000044878" tvg-logo="https://sonypicturesnetworks.com/images/logos/Sony_MAX2.png" group-title="SonyLiv", Sony MAX2
https://dai.google.com/ssai/event/4Jcu195QTpCNBXGnpw2I6g/master.m3u8
#EXTINF:-1 tvg-id="1000009280" tvg-logo="https://sonypicturesnetworks.com/images/logos/SONY_SportsTen1_SD_Logo_CLR.png" group-title="SonyLiv", Sony TEN 1
https://dai.google.com/ssai/event/4_pnLi2QTe6bRGvvahRbfg/master.m3u8
#EXTINF:-1 tvg-id="1000009279" tvg-logo="https://sonypicturesnetworks.com/images/logos/SONY_SportsTen2_SD_Logo_CLR.png" group-title="SonyLiv", Sony TEN 2
https://dai.google.com/ssai/event/nspQRqO5RmC06VmlPrTwkQ/master.m3u8
#EXTINF:-1 tvg-id="1000009283" tvg-logo="https://sonypicturesnetworks.com/images/logos/SONY_SportsTen3_SD_Logo_CLR.png" group-title="SonyLiv", Sony TEN 3
https://dai.google.com/ssai/event/9kocjiLUSf-erlSrv3d4Mw/master.m3u8
#EXTINF:-1 tvg-id="1000119187" tvg-logo="https://sonypicturesnetworks.com/images/logos/SONY_SportsTen4_SD_Logo_CLR.png" group-title="SonyLiv", Sony TEN 4
https://dai.google.com/ssai/event/hInaEKUJSziZAGv9boOdjg/master.m3u8
#EXTINF:-1 tvg-id="1000009281" tvg-logo="https://sonypicturesnetworks.com/images/logos/SONY_SportsTen5_SD_Logo_CLR.png" group-title="SonyLiv", Sony TEN 5
https://dai.google.com/ssai/event/S-q8I27RRzmkb-OIdoaiAw/master.m3u8
#EXTINF:-1 tvg-id="1000009276" tvg-logo="https://sonypicturesnetworks.com/images/logos/SONY_SportsTen1_HD_Logo_CLR.png" group-title="SonyLiv", Sony TEN 1 HD
https://dai.google.com/ssai/event/yeYP86THQ4yl7US8Zx5eug/master.m3u8
#EXTINF:-1 tvg-id="1000009277" tvg-logo="https://sonypicturesnetworks.com/images/logos/SONY_SportsTen2_HD_Logo_CLR.png" group-title="SonyLiv", Sony TEN 2 HD
https://dai.google.com/ssai/event/Syu8F41-R1y_JmQ7x0oNxQ/master.m3u8
#EXTINF:-1 tvg-id="1000009278" tvg-logo="https://sonypicturesnetworks.com/images/logos/SONY_SportsTen3_HD_Logo_CLR.png" group-title="SonyLiv", Sony TEN 3 HD
https://dai.google.com/ssai/event/nmQFuHURTYGQBNdUG-2Qdw/master.m3u8
#EXTINF:-1 tvg-id="1000119186" tvg-logo="https://sonypicturesnetworks.com/images/logos/SONY_SportsTen4_HD_Logo_CLR.png" group-title="SonyLiv", Sony TEN 4 HD
https://dai.google.com/ssai/event/x4LxWUcVSIiDaq1VCM7DSA/master.m3u8
#EXTINF:-1 tvg-id="1000009275" tvg-logo="https://sonypicturesnetworks.com/images/logos/SONY_SportsTen5_HD_Logo_CLR.png" group-title="SonyLiv", Sony TEN 5 HD
https://dai.google.com/ssai/event/DD7fA-HgSUaLyZp9AjRYxQ/master.m3u8\n
`;

export default async function handler(req, res) {
    let uData = {
        tsActive: true
    };

    if (uData.tsActive) {
        let m3uString = additionalChannels + await generateM3u(uData);
        res.status(200).send(m3uString);
    }
}

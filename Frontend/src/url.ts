class URL {
  ip: string;
  port: string;

  constructor(ip: string, port: string) {
    this.ip = ip;
    this.port = port;
  }

  fullString() {
    return this.ip + ":" + this.port;
  }
}

/* Assumes we're working with vite dev. Assumes the URL is in the format http://...../....
 * Works for localhost, LAN (192.168.x.x) and global ip (e.g. 99.x.x.x)
 */
function getClientURL(): URL {
  const fullURL = import.meta.url;
  const prefix = "http://";
  if (!fullURL.startsWith(prefix)) {
    console.log(
      "The URL does not start with http:// so the client URL will likely not be correctly parsed"
    );
  }

  const prefixlessURL = fullURL.slice(prefix.length);

  const slashIndex = prefixlessURL.indexOf("/");
  const prefixlessBaseURL = prefixlessURL.slice(0, slashIndex);
  const [prefixlessIp, port] = prefixlessBaseURL.split(":");

  return new URL(prefix + prefixlessIp, port);
}

export const clientURL = getClientURL();

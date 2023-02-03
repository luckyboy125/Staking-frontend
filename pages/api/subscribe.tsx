import axios from "axios";
import requestIp from "request-ip";

var ip = require("ipaddr.js");
var querystring = require("querystring");
const API_URL = "https://staking-api.zilionixx.com/api/v1/promoter";

function cleanupAddress(str: any) {
  // if it's a valid ipv6 address, and if its a mapped ipv4 address,
  // then clean it up. otherwise return the original string.
  if (ip.IPv6.isValid(str)) {
    var addr = ip.IPv6.parse(str);
    if (addr.isIPv4MappedAddress()) return addr.toIPv4Address().toString();
  }
  return str;
}

export default async (req: any, res: any) => {
  const detectedIp = requestIp.getClientIp(req);
  const { query } = req.body;
  const ipAddress = cleanupAddress(detectedIp);

  // console.log("Promoter occurred from ", ipAddress, req.headers["user-agent"]);
  if (query === undefined) {
    return res.status(400).json({
      error: "there is no params",
    });
  }

  try {
    const response = await axios.post(
      API_URL,
      querystring.stringify({
        account: query,
        ipaddress: ipAddress,
        device: req.headers["user-agent"],
      })
    );
    return res
      .status(200)
      .json({
        Success: response.data.Success,
        Error: response.data.Error,
      });
  } catch (error) {
    return res.status(200).json({
      Error: `Oops, something went wrong...`,
      Success: false,
    });
  }
};

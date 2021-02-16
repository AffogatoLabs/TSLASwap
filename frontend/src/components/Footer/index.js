import React, { useContext } from "react";
import styled, { css, ThemeContext } from "styled-components";
import { Box } from "@material-ui/core";

const Footer = (props) => {
  const themeContext = useContext(ThemeContext);
  return (
    <Box
        style={{
          backgroundColor: themeContext["primaryBackground"],
          border: "none",
          fontSize: themeContext["fontSizes"]["footerText"],
          padding: 20,
          position: "fixed",
          bottom: "0",
          display: "grid",
        }}
    >
      <Box> Powered By Synthetix and Curve</Box>
      <Box> Contract: https://etherscan.io/address/0xa3dea1c91055180f3037d6f111bfa7f0fc7c03a8</Box>
      <Box
        style={{
          backgroundColor: themeContext["primaryBackground"],
          border: "none",
          fontSize: themeContext["fontSizes"]["footerText"],
        }}
      >
        TeslaSwap (the "Service") is an experimental service provided "AS-IS" as
        a technical demonstration of the capacities of the Synthetix protocol.
        This Service has not been audited and should not be used with assets
        that you cannot afford to lose. Use this Service in a responsible manner
        and only at your own risk.
        <br />
        The TeslaSwap Developer ("Developer") makes no other warranties, express
        or implied, and hereby disclaims all implied warranties, including any
        warranty of merchantability and warranty of fitness for a particular
        purpose. The Developer is not responsible or liable for any losses
        incurred as a result of using this Service.
        <br />
        By using this Service, you hereby acknowledge the experimental nature of
        the Service and the risks involved, and indemnify the Developer of
        responsibility for any and all possible losses as a result of using the
        Service. As you use the Service, you agree to proceed with
        circumspection and an understanding of the risks involved. In no event
        shall the Developer be liable for any claim, damages or other liability,
        including any general, special, direct, incidental, or consequnetial
        damages, whether in an action of contract, tort or otherwise, arising
        from, out of the use or inability to use the Service or from other
        dealings with or in the Service.
      </Box>
    </Box>
  );
};

export default Footer;

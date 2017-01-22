import _ from "lodash";

const OFX_HEADER = `OFXHEADER:100
DATA:OFXSGML
VERSION:102
SECURITY:NONE
ENCODING:UTF-8
CHARSET:NONE
COMPRESSION:NONE
OLDFILEUID:NONE
NEWFILEUID:NONE

<OFX>
  <SIGNONMSGSRSV1>
    <SONRS>
      <STATUS>
        <CODE>0</CODE>
        <SEVERITY>INFO</SEVERITY>
      </STATUS>
      <DTSERVER>20150831</DTSERVER>
      <LANGUAGE>ENG</LANGUAGE>
    </SONRS>
  </SIGNONMSGSRSV1>
  <BANKMSGSRSV1>
    <STMTTRNRS>
      <TRNUID>1</TRNUID>
      <STATUS>
        <CODE>0</CODE>
        <SEVERITY>INFO</SEVERITY>
      </STATUS>
      <STMTRS>
        <CURDEF>EUR</CURDEF>
        <BANKACCTFROM>
          <BANKID>72277143</BANKID>
          <ACCTID>72277141</ACCTID>
          <ACCTTYPE>CHECKING</ACCTTYPE>
        </BANKACCTFROM>

        <BANKTRANLIST>
          {{transactions}}
        </BANKTRANLIST>

        <LEDGERBAL>
          <BALAMT>0,00</BALAMT>
          <DTASOF>20150831</DTASOF>
        </LEDGERBAL>
      </STMTRS>
    </STMTTRNRS>
  </BANKMSGSRSV1>
</OFX>
`;

const OFX_TRANSACTION = `
<STMTTRN>
    <TRNTYPE>OTHER</TRNTYPE>
    <DTPOSTED>{{date}}</DTPOSTED>
    <TRNAMT>{{amount}}</TRNAMT>
    <FITID>{{id}}</FITID>
    <NAME>{{name}}</NAME>
</STMTTRN>`;


function getName(rowData) {
    let name = "Unknown";

    if (rowData.supplierFound && rowData.supplierFound.length > 0) {
        name = _.startCase(rowData.supplierFound);
    }
    else if (rowData.label !== undefined) {
        name = rowData.label.replace(/PAIEMENT CARTE [0-9]* /, "");
    }

    return _.startCase(_.lowerCase(name));
}


function getDate(rowData) {
    const [d, m, y] = rowData.dateOp.split("/");

    return y + m + d;
}


function generateOfx(csvRows) {
    let ofxTransactions = "";

    for (let index = 0; index < csvRows.length; index++) {
        let rowData = csvRows[index];
        ofxTransactions += OFX_TRANSACTION
            .replace("{{date}}", getDate(rowData))
            .replace("{{amount}}", rowData.amount)
            .replace("{{id}}", index)
            .replace("{{name}}", getName(rowData));
    }

    return OFX_HEADER.replace("{{transactions}}", ofxTransactions);
}


export default generateOfx;

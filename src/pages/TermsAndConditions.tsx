/* eslint-disable @typescript-eslint/no-explicit-any */
import { Flex, Button, Text, Table, TableBody, TableRow, TableCell, TableHeader, TableHeaderCell, Page, PageHeader, PageHeaderRow, PageHeading, PageContent, Bleed, Stack } from "@vtex/shoreline";
import { useNavigate } from "react-router-dom";

export interface TermsProps {
  open: boolean,
  approve: () => void,
  dismiss: () => void,
}

export function TermsAndConditions() {
  const navigate = useNavigate();

  return (
    <Page>
      <PageHeader>
        <PageHeaderRow style={{ height: '44px' }}>
          <PageHeading>
            {t("terms.title")}
          </PageHeading>

          <Stack space="$space-4" horizontal>
            <Bleed top="$space-2" bottom="$space-2">
              <Button size="large" onClick={() => navigate('/agent-details')}>{t("common.cancel")}</Button>
            </Bleed>

            <Bleed top="$space-2" bottom="$space-2">
              <Button variant="primary" size="large" onClick={() => navigate('/agent-builder')}>{t("terms.agree")}</Button>
            </Bleed>
          </Stack>
        </PageHeaderRow>
      </PageHeader>

      <PageContent style={{ margin: '0', maxWidth: '100vw' }}>
        <Flex direction="column" >
          <Text variant="body">{t("terms.description1")}</Text>
          <Text variant="body">{t("terms.description2")}</Text>
          <Flex direction="column" style={{ gap: '8px' }}>
            <Text variant="emphasis">{t("terms.definition.title")}</Text>
            <Text variant="body" style={{ padding: '0px 12px' }}>{t("terms.definition.description.1")}</Text>
            <Text variant="body" style={{ padding: '0px 12px' }}>{t("terms.definition.description.2")}</Text>
          </Flex>
          <Flex direction="column" style={{ gap: '8px' }}>
            <Text variant="emphasis">{t("terms.responsabilities.title")}</Text>
            <Text variant="body" style={{ padding: '0px 12px' }}>{t("terms.responsabilities.description.1")}</Text>
            <Text variant="body" style={{ padding: '0px 12px' }}>{t("terms.responsabilities.description.2")}</Text>
            <Text variant="body" style={{ padding: '0px 12px' }}>{t("terms.responsabilities.description.3")}</Text>
          </Flex>
          <Flex direction="column" style={{ gap: '8px' }}>
            <Text variant="emphasis">{t("terms.vtex_responsabilites.title")}</Text>
            <Text variant="body" style={{ padding: '0px 12px' }}>{t("terms.vtex_responsabilites.description.1")}</Text>
            <Text variant="body" style={{ padding: '0px 12px' }}>{t("terms.vtex_responsabilites.description.2")}</Text>
          </Flex>
          <Flex direction="column" style={{ gap: '8px' }}>
            <Text variant="emphasis">{t("terms.services.title")}</Text>
            <Text variant="body" style={{ padding: '0px 12px' }}>{t("terms.services.description.1")}</Text>

            <Text variant="body" style={{ padding: '0px 12px' }}>{t("terms.services.description.2")}</Text>
          </Flex>
          <Flex direction="column" style={{ gap: '8px' }}>
            <Text variant="emphasis">{t("terms.contracting.title")}</Text>
            <Text variant="body" style={{ padding: '0px 12px' }}>{t("terms.contracting.description.1")}</Text>
            <Text variant="body" style={{ padding: '0px 12px' }}>{t("terms.contracting.description.2")}</Text>
            <Text variant="body" style={{ padding: '0px 12px' }}>{t("terms.contracting.description.3")}</Text>
            <Text variant="body" style={{ padding: '0px 12px' }}>{t("terms.contracting.description.4.title")}</Text>
            <Text variant="body" style={{ padding: '0px 18px' }}>{t("terms.contracting.description.4.items.1")}</Text>
          </Flex>
          <Flex direction="column" style={{ gap: '8px' }}>
            <Text variant="emphasis">{t("terms.payment.title")}</Text>
            <Text variant="body" style={{ padding: '0px 12px' }}>{t("terms.payment.description.1")}</Text>

            <Table
              columnWidths={[
                '25%',
                '25%',
                '25%',
                '25%',
              ]}
              style={{ tableLayout: 'fixed' }}
            >
              <TableHeader>
                <TableRow>
                  <TableHeaderCell style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    {t("terms.payment.description.table.headers.feature")}
                  </TableHeaderCell>
                  <TableHeaderCell style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    {t("terms.payment.description.table.headers.starter")}
                  </TableHeaderCell>
                  <TableHeaderCell style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    {t("terms.payment.description.table.headers.corporate")}
                  </TableHeaderCell>
                  <TableHeaderCell style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    {t("terms.payment.description.table.headers.enterprise")}
                  </TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.values(t("terms.payment.description.table.rows", { returnObjects: true })).map((row: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                      {row.feature}
                    </TableCell>
                    <TableCell style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                      {row.starter}
                    </TableCell>
                    <TableCell style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                      {row.corporate}
                    </TableCell>
                    <TableCell style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                      {row.enterprise}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Flex>
          <Text variant="body" style={{ padding: '0px 12px', fontWeight: 'bold' }}>{t("terms.payment.description.note")}</Text>
          <Text variant="body" style={{ padding: '0px 12px' }}>{t("terms.payment.description.2")}</Text>
          <Flex direction="column" style={{ gap: '8px' }}>
            <Text variant="emphasis">{t("terms.final.title")}</Text>
            <Text variant="body" style={{ padding: '0px 12px' }}>{t("terms.final.description.1")}</Text>
            <Text variant="body" style={{ padding: '0px 12px' }}>{t("terms.final.description.2")}</Text>
            <Text variant="body" style={{ padding: '0px 12px' }}>{t("terms.final.description.3")}</Text>

          </Flex>
        </Flex>
      </PageContent>
    </Page>
  )
}

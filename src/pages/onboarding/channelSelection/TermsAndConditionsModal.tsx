import {
  Flex,
  Button,
  Text,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHeader,
  TableHeaderCell,
  Modal,
  ModalHeader,
  ModalHeading,
  ModalDismiss,
  ModalContent,
  ModalFooter,
} from "@vtex/shoreline";
import { useTranslation } from "react-i18next";

export interface TermsAndConditionsModalProps {
  open: boolean;
  onClose: () => void;
}

export function TermsAndConditionsModal({ open, onClose }: TermsAndConditionsModalProps) {
  const { t } = useTranslation();

  return (
    <Modal open={open} onClose={onClose} size="large">
      <ModalHeader>
        <ModalHeading>{t("terms.title")}</ModalHeading>
        <ModalDismiss />
      </ModalHeader>

      <ModalContent>
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
                {Object.values(t("terms.payment.description.table.rows", { returnObjects: true })).map((row: { feature: string; starter: string; corporate: string; enterprise: string; }, index: number) => (
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
      </ModalContent>

      <ModalFooter>
        <Button variant="primary" onClick={onClose}>{t("common.close")}</Button>
      </ModalFooter>
    </Modal>
  );
}
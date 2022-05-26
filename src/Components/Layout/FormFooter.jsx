import { useI18n } from "../../lang";

const FormFooter = () => {
  // Lang Context
  const { t } = useI18n();
  return (
    <div>
      <hr className="mt_mb" style={{ color: "red" }} />
      <ul className="txt_12_grey">
        <li>{t("form_footer_text_1")}</li>
        <br />
        <li>{t("form_footer_text_2")}</li>
        <br />
        <li>{t("form_footer_text_3")}</li>
        <br />
        <li>{t("form_footer_text_4")}</li>
        <br />
        <li>{t("form_footer_text_5")}</li>
        <br />
        <li>{t("form_footer_text_6")}</li>
        <br />
        <li>{t("form_footer_text_7")}</li>

        {process.env.REACT_APP_HOST_NAME === "88U" && (
          <>
            <br />
            <li>{t("form_footer_text_8")}</li>
            <br />
            <li>{t("form_footer_text_9")}</li>
            <br />
            <li>{t("form_footer_text_10")}</li>
          </>
        )}
      </ul>
    </div>
  );
};

export default FormFooter;

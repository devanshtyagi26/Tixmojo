import React from 'react'
import { useTranslation } from 'react-i18next';
import '../i18n';

const styles = {
    logo:{
        color: 'rgb(0, 0, 0)',
        fontFamily: 'Cabin',
        fontSize: '23.3px',
        fontWeight: '700',
        lineHeight: '28px',
        letterSpacing: '0%',
        textAlign: 'left',
        marginLeft: '1rem',
        },      
}
function Logo({style}) {
    const { t } = useTranslation();
  return (
    <div style={style || styles.logo}>{t("navbar.logo")}</div>
  )
}

export default Logo
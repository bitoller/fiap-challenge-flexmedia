-- FlexCheck Hotel - reset do schema Oracle
-- Use este script no usuario/schema do projeto antes de recriar as tabelas.

BEGIN
    FOR table_name IN (
        SELECT 'FC_AUDIT_LOG' AS name FROM dual UNION ALL
        SELECT 'FC_PMS_EVENT' FROM dual UNION ALL
        SELECT 'FC_DEVICE_EVENT' FROM dual UNION ALL
        SELECT 'FC_KEY_CREDENTIAL' FROM dual UNION ALL
        SELECT 'FC_PAYMENT_TRANSACTION' FROM dual UNION ALL
        SELECT 'FC_STAY' FROM dual UNION ALL
        SELECT 'FC_BIOMETRY_VERIFICATION' FROM dual UNION ALL
        SELECT 'FC_DOCUMENT_VERIFICATION' FROM dual UNION ALL
        SELECT 'FC_CONSENT' FROM dual UNION ALL
        SELECT 'FC_CHECKIN_SESSION' FROM dual UNION ALL
        SELECT 'FC_KIOSK_DEVICE' FROM dual UNION ALL
        SELECT 'FC_RESERVATION_GUEST' FROM dual UNION ALL
        SELECT 'FC_RESERVATION' FROM dual UNION ALL
        SELECT 'FC_GUEST' FROM dual UNION ALL
        SELECT 'FC_ROOM' FROM dual UNION ALL
        SELECT 'FC_HOTEL' FROM dual
    ) LOOP
        BEGIN
            EXECUTE IMMEDIATE 'DROP TABLE ' || table_name.name || ' CASCADE CONSTRAINTS PURGE';
        EXCEPTION
            WHEN OTHERS THEN
                IF SQLCODE != -942 THEN
                    RAISE;
                END IF;
        END;
    END LOOP;
END;
/


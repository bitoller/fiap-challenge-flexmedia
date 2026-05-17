SELECT 'FC_HOTEL' AS table_name, COUNT(*) AS total FROM fc_hotel
UNION ALL
SELECT 'FC_ROOM', COUNT(*) FROM fc_room
UNION ALL
SELECT 'FC_GUEST', COUNT(*) FROM fc_guest
UNION ALL
SELECT 'FC_RESERVATION', COUNT(*) FROM fc_reservation
UNION ALL
SELECT 'FC_KIOSK_DEVICE', COUNT(*) FROM fc_kiosk_device
UNION ALL
SELECT 'FC_CHECKIN_SESSION', COUNT(*) FROM fc_checkin_session
UNION ALL
SELECT 'FC_STAY', COUNT(*) FROM fc_stay
UNION ALL
SELECT 'FC_AUDIT_LOG', COUNT(*) FROM fc_audit_log;

SELECT
    r.reservation_code,
    r.status,
    g.full_name,
    room.room_number,
    r.arrival_date,
    r.departure_date,
    r.total_amount
FROM fc_reservation r
JOIN fc_reservation_guest rg ON rg.reservation_id = r.id AND rg.is_primary = 'Y'
JOIN fc_guest g ON g.id = rg.guest_id
LEFT JOIN fc_room room ON room.id = r.room_id
ORDER BY r.reservation_code;


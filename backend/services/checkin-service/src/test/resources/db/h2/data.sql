INSERT INTO fc_hotel (id, name, timezone, checkin_time, checkout_time, early_checkin_minutes, late_checkout_minutes, created_at)
VALUES (1, 'Flex Hotel Paulista', 'America/Sao_Paulo', '14:00', '12:00', 120, 60, CURRENT_TIMESTAMP);

INSERT INTO fc_room (id, hotel_id, room_number, room_type, status, floor_number)
VALUES (1, 1, '1204', 'STANDARD', 'AVAILABLE', 12);

INSERT INTO fc_room (id, hotel_id, room_number, room_type, status, floor_number)
VALUES (2, 1, '1501', 'DELUXE', 'AVAILABLE', 15);

INSERT INTO fc_guest (id, full_name, document_type, document_number, birth_date, nationality, email, phone, created_at)
VALUES (1, 'Marcos Alberto', 'CPF', '12345678909', DATE '1995-08-15', 'Brasileira', 'marcos@example.com', '+5511999999999', CURRENT_TIMESTAMP);

INSERT INTO fc_guest (id, full_name, document_type, document_number, birth_date, nationality, email, phone, created_at)
VALUES (2, 'Marcos Alberto', 'CPF', '98765432100', DATE '1998-03-22', 'Brasileira', 'marina@example.com', '+5511988888888', CURRENT_TIMESTAMP);

INSERT INTO fc_reservation (id, hotel_id, room_id, reservation_code, pms_external_id, status, arrival_date, departure_date, adults, children, total_amount, currency, created_at)
VALUES (1, 1, 1, 'RSV-2026-0001', 'PMS-0001', 'CONFIRMED', CURRENT_DATE, DATEADD('DAY', 2, CURRENT_DATE), 1, 0, 780.00, 'BRL', CURRENT_TIMESTAMP);

INSERT INTO fc_reservation (id, hotel_id, room_id, reservation_code, pms_external_id, status, arrival_date, departure_date, adults, children, total_amount, currency, created_at)
VALUES (2, 1, 2, 'RSV-2026-0002', 'PMS-0002', 'CONFIRMED', CURRENT_DATE, DATEADD('DAY', 1, CURRENT_DATE), 1, 0, 420.00, 'BRL', CURRENT_TIMESTAMP);

INSERT INTO fc_reservation_guest (reservation_id, guest_id, is_primary)
VALUES (1, 1, 'Y');

INSERT INTO fc_reservation_guest (reservation_id, guest_id, is_primary)
VALUES (2, 2, 'Y');

INSERT INTO fc_kiosk_device (id, hotel_id, device_code, name, status, last_seen_at, created_at)
VALUES (1, 1, 'KIOSK-PAULISTA-01', 'Totem Recepcao 01', 'ONLINE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

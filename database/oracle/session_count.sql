-- FlexCheck Hotel - session count diagnostic

SELECT COUNT(*) AS session_count
  FROM v$session
 WHERE username = 'RM553134';


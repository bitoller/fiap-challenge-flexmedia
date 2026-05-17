SELECT COUNT(*) AS session_count
  FROM v$session
 WHERE username = 'FLEXCHECK_APP';

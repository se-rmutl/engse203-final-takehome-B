function ErrorState({ message, onRetry, children }) {
  return (
    <section className="state-card error-state" role="alert">
      <h2>โหลดข้อมูลไม่สำเร็จ</h2>
      <p>{message}</p>
      {children}
      {onRetry && <button className="button primary" type="button" onClick={onRetry}>ลองอีกครั้ง</button>}
    </section>
  );
}

export default ErrorState;

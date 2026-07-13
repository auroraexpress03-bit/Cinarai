export function shouldNotifyPageChange({
  numPages,
  initialLoadRef,
}: {
  numPages: number;
  initialLoadRef: { current: boolean };
}): boolean {
  if (numPages <= 0) {
    return false;
  }

  if (initialLoadRef.current) {
    initialLoadRef.current = false;
    return false;
  }

  return true;
}

export function markNextDocumentLoadAsInitial(initialLoadRef: { current: boolean }): void {
  initialLoadRef.current = true;
}

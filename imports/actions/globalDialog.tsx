export function openDialog(dialog: string) {
  return {
    type: `OPEN_${dialog}`,
  };
}

export function closeDialog(dialog: string) {
  return {
    type: `CLOSE_${dialog}`,
  };
}

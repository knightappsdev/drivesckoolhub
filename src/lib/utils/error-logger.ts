export function logError(context: string, error: unknown) {
  const timestamp = new Date().toISOString();
  const errorMessage = error instanceof Error ? error.message : String(error);
  const stackTrace = error instanceof Error ? error.stack : 'No stack trace';
  
  console.group(`🚨 Error in ${context} - ${timestamp}`);
  console.error('Message:', errorMessage);
  console.error('Stack:', stackTrace);
  console.groupEnd();
  
  // In production, you'd send this to a logging service
  return {
    context,
    message: errorMessage,
    timestamp,
    stack: stackTrace
  };
}
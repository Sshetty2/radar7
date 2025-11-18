// TODO: Chat UI removed during Next.js 16 + AI SDK v5 upgrade
// Will be re-added from updated template when needed

export default async function Page (props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  return (
    <div className="flex h-full flex-col items-center justify-center p-4 text-center">
      <h1 className="text-2xl font-bold">Chat UI Coming Soon</h1>
      <p className="mt-2 text-muted-foreground">
        Chat ID: {params.id}
      </p>
      <p className="mt-4 max-w-md text-sm text-muted-foreground">
        The chat interface will be added back from the updated template repository.
      </p>
    </div>
  );
}

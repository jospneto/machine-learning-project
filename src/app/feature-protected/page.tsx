const Page = () => (
  <div className="flex min-h-screen flex-col items-center justify-center p-24">
    <h1 className="mb-4 text-4xl font-bold">Protected Feature Page</h1>
    <p className="text-lg text-gray-600">
      This page is only accessible when the feature flag is enabled.
    </p>
  </div>
);

export default Page;

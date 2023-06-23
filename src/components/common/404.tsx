/* eslint-disable react/no-unknown-property */
export const NotFound404 = () => {
  return (
    <>
      <div className="hit-the-floor text-slate-50 dark:text-neutral-400">
        404
      </div>

      <p>你来到了没有知识的荒原</p>
      <style global jsx>
        {`
          .hit-the-floor {
            font-size: 12em;
            font-weight: bold;
            font-family: Helvetica;
            text-shadow: 0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb,
              0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0, 0, 0, 0.1),
              0 0 5px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.3),
              0 3px 5px rgba(0, 0, 0, 0.2), 0 5px 10px rgba(0, 0, 0, 0.25),
              0 10px 10px rgba(0, 0, 0, 0.2), 0 20px 20px rgba(0, 0, 0, 0.15);
          }
        `}
      </style>
    </>
  )
}

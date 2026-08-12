export const EGG_DEFAULT_POINTS = 1;

export const appText = {
  brand: {
    name: 'Eggeo',
    title: 'EGGEO',
  },
  auth: {
    actions: {
      createAccount: 'Create account',
      login: 'Log in',
      needAccount: 'Need an account?',
      haveAccount: 'Already have an account?',
    },
    fields: {
      email: 'Email',
      name: 'Name',
      password: 'Password',
    },
    messages: {
      genericError: 'Something went wrong.',
      requestFailed: 'Request failed.',
      signedIn: 'Signed in.',
      readyToHunt(points: number) {
        return `Ready to hunt. Default eggs are worth ${points} point.`;
      },
      signedInAs(name: string) {
        return `Signed in as ${name}.`;
      },
    },
  },
  common: {
    actions: {
      close: 'Close',
      delete: 'Delete',
      signOut: 'Sign out',
      submit: 'Submit',
    },
    status: {
      loading: '...',
    },
  },
  events: {
    actions: {
      create: 'Create Event',
      join: 'Join Event',
    },
    fields: {
      description: 'Description',
      title: 'Event name',
    },
    labels: {
      allEggs: 'All Eggs',
      eventQr: 'Event QR',
      noEvent: 'No Event',
      selectEvent: 'Select an Event',
      untitled: 'Untitled Event',
    },
    messages: {
      created: 'Event created.',
      deleted: 'Event deleted.',
      invalidCode: 'Scan a valid egg or event QR code.',
      joined(title: string) {
        return `Joined ${title}.`;
      },
      noEvents: 'No events yet.',
      unableToCreate: 'Unable to create event.',
      unableToDelete: 'Unable to delete event.',
      unableToJoin: 'Unable to join event.',
      unableToLoad: 'Unable to load events.',
    },
  },
  eggs: {
    actions: {
      collectNow: 'Collect Egg Now',
      find: 'Find',
      hideHere: 'Hide Egg Here',
      leaveHidden: 'Leave Egg Hidden',
      resetScore: 'Reset Score',
    },
    fields: {
      color: 'Color',
      count: 'Number of Eggs',
      description: 'Description',
      eggCodeOrLink: 'Egg code or link',
      latitude: 'Latitude',
      longitude: 'Longitude',
      points: 'Points per egg',
      title: 'Title',
    },
    labels: {
      eggFound: 'Egg found',
      noDescription: 'No description yet.',
      untitled: 'Untitled Egg',
    },
    messages: {
      collected: 'Egg Collected!',
      created(count: number) {
        return `Created ${count} ${count === 1 ? 'egg' : 'eggs'}.`;
      },
      hidden: 'Egg Hidden!',
      invalidCode: 'Enter a valid egg code or egg link.',
      noPrintableEggs: 'No printable eggs yet.',
      selectEventToPrint: 'Select an event to print eggs.',
      unableToPrint: 'Unable to print eggs.',
      unableToCollect: 'Unable to collect egg.',
      unableToCreate: 'Unable to create eggs.',
      unableToFind: 'Unable to find egg.',
      unableToHide: 'Unable to hide egg.',
      unableToLoadEggs: 'Unable to load eggs.',
    },
    points(points?: number | null) {
      const value = points ?? 1;
      return Math.abs(value) === 1 ? `${value} pt.` : `${value} pts.`;
    },
  },
  map: {
    messages: {
      mobilePlaceholder: 'Mobile map view is ready for native maps/location wiring. Use Find or Hide while we add device map support.',
    },
  },
  nav: {
    codes: 'Print',
    create: 'Create',
    dashboard: 'Home',
    events: 'Events',
    find: 'Find',
    hide: 'Hide',
    leaderboard: 'Ranking',
    locator: 'Map',
    panel: 'User',
    print: 'Print',
    score: 'Reset Score',
  },
  score: {
    messages: {
      noScores: 'No scores yet.',
      reset: 'Score reset.',
      signedInAs(name: string) {
        return `Signed in as ${name}.`;
      },
      unableToLoadRanking: 'Unable to load ranking.',
    },
    points(points: number) {
      return Math.abs(points) === 1 ? `${points} pt.` : `${points} pts.`;
    },
  },
} as const;

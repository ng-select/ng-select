# Copilot Instructions for Angular Projects

1. **Use the Latest Angular and TypeScript**
   - Always use the latest stable version of Angular (currently v20) and TypeScript.
   - Code examples must reference Angular 20+ APIs and features.
   - If unsure about a feature or API, refer to the [Angular Docs](https://angular.dev/).

2. **Modern Angular Features Only**
   - Always prefer Angular control flow syntax over legacy structural directives.
   - Use Angular signals for state management and reactivity.
   - Prefer input signals and output signals for component communication. See: [inputs](https://angular.dev/reference/api/core/InputSignal), [outputs](https://angular.dev/reference/api/core/OutputSignal).

3. **No Legacy Decorators**
   - Do not use or recommend `@Input` and `@Output` decorators in new examples.
   - Use signals and Angular's latest patterns for data flow and events.

4. **Template Syntax & Style**
   - Use the latest template syntax and best practices, such as `@for`, `@if`, `@switch` (Angular's new control flow).
   - Always use `<ng-container>` for structural grouping when needed.

5. **Component Architecture**
   - Prefer standalone components wherever possible (avoid NgModules for new features unless there’s a clear need).
   - Encourage use of feature encapsulation with self-contained, reusable components.

6. **Type Safety & Strictness**
   - Enable `"strict": true` in `tsconfig.json` for all projects.
   - Always provide explicit types for function signatures, variables, and observables.

7. **Dependency Injection**
   - Use `@Injectable({providedIn: 'root'})` for services unless there's a reason for a different scope.
   - Always prefer Angular DI patterns over manual instantiation or singleton hacks.

8. **API Communication**
   - Use Angular’s `HttpClient` for all HTTP/API interactions.
   - Prefer typed HTTP responses and error handling using RxJS.

9. **State Management**
   - For component-level state, use signals.
   - For app-wide state, recommend using signals-based libraries or lightweight solutions compatible with Angular 20+ (e.g., SignalStore, Akita signals, etc.), but avoid heavy, legacy state libraries like NgRx unless necessary.

10. **Testing**
    - All code examples should include unit test snippets where applicable.
    - Use Angular’s karma, jasmine testing APIs.

11. **Accessibility**
    - Ensure all code examples follow WCAG guidelines and Angular’s accessibility best practices.

12. **Documentation and Comments**
    - Comment public APIs, inputs, and outputs in all examples.
    - Reference Angular style guide for structure and naming conventions.

13. **No Deprecated APIs**
    - Never recommend deprecated Angular APIs, patterns, or features.
    - Double-check breaking changes or removals for each new Angular version [here](https://update.angular.io/).

import Link from "next/link";
import { Zap, CheckCircle2, ArrowRight } from "lucide-react";
import { PrintButton } from "./print-button";

export const metadata = { title: "TurnReady – User Guide" };

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .page-break { page-break-before: always; }
          body { font-size: 13px; }
        }
      `}</style>

      {/* Top bar */}
      <div className="no-print sticky top-0 z-50 border-b bg-white/95 backdrop-blur px-6 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          ← Back to app
        </Link>
        <PrintButton />
      </div>

      <div className="mx-auto max-w-4xl px-8 py-12 text-slate-800">

        {/* Cover Page */}
        <div className="text-center mb-20 pb-16 border-b border-slate-200">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg mb-6">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-slate-900 tracking-tight">TurnReady</h1>
          <p className="mt-3 text-xl text-slate-500">Complete User Guide</p>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-4 py-2">
            <span className="text-sm text-blue-700 font-medium">Property Management · Make-Ready Workflow Software</span>
          </div>
          <p className="mt-8 text-slate-400 text-sm">Version 1.0 · {new Date().getFullYear()}</p>
        </div>

        {/* Table of Contents */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Table of Contents</h2>
          <div className="space-y-2 border border-slate-200 rounded-xl overflow-hidden">
            {[
              { num: "1", title: "What is TurnReady?", desc: "Overview and main concepts" },
              { num: "2", title: "Getting Started", desc: "Account setup and first steps" },
              { num: "3", title: "Properties", desc: "Add and manage your properties" },
              { num: "4", title: "Units", desc: "Add units to your properties" },
              { num: "5", title: "Turnovers", desc: "Create and manage unit turnovers" },
              { num: "6", title: "Tasks", desc: "Track work with tasks" },
              { num: "7", title: "Task Templates", desc: "Reusable task lists" },
              { num: "8", title: "Cost Tracking", desc: "Track estimated and actual costs" },
              { num: "9", title: "Photo Uploads", desc: "Document unit conditions" },
              { num: "10", title: "Team Management", desc: "Invite and manage team members" },
              { num: "11", title: "Dashboard", desc: "Monitor your workspace at a glance" },
              { num: "12", title: "Billing & Plans", desc: "Free, Pro, and Business plans" },
              { num: "13", title: "Tips & Best Practices", desc: "Get the most out of TurnReady" },
            ].map((item) => (
              <div key={item.num} className="flex items-center gap-4 px-5 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold shrink-0">{item.num}</span>
                <span className="font-medium text-slate-900">{item.title}</span>
                <span className="text-slate-400 text-sm ml-auto">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 1 */}
        <Section num="1" title="What is TurnReady?">
          <p className="text-slate-600 leading-relaxed">
            TurnReady is a professional property management software designed specifically for
            <strong> unit turnover and make-ready workflows</strong>. When a tenant moves out, there is always
            work to be done before the next tenant can move in — cleaning, repairs, painting, inspections.
            TurnReady gives your team one central place to manage all of this.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { icon: "🏢", title: "Multi-Property", desc: "Manage multiple properties and hundreds of units from one account" },
              { icon: "✅", title: "Task Tracking", desc: "Assign tasks to vendors and staff, track completion in real-time" },
              { icon: "📊", title: "Full Visibility", desc: "Know exactly what is done, what is overdue, and what is blocked" },
            ].map((c) => (
              <div key={c.title} className="rounded-xl border border-slate-200 p-4">
                <div className="text-2xl mb-2">{c.icon}</div>
                <p className="font-semibold text-slate-900 text-sm">{c.title}</p>
                <p className="text-slate-500 text-xs mt-1">{c.desc}</p>
              </div>
            ))}
          </div>
          <InfoBox>
            <strong>Key concept:</strong> The workflow is always <em>Property → Units → Turnovers → Tasks</em>. You set up your properties first, add units to them, then create a turnover when a tenant moves out, and add tasks to that turnover.
          </InfoBox>
        </Section>

        {/* Section 2 */}
        <Section num="2" title="Getting Started">
          <p className="text-slate-600 leading-relaxed mb-6">Follow these steps to get your workspace ready in under 10 minutes:</p>
          <Steps items={[
            { title: "Create your account", desc: 'Go to the sign-up page, enter your name, company name, email and password. Click "Create free workspace".' },
            { title: "Set up your first property", desc: 'Go to Properties → click "Add Property". Fill in the property name, address, city, state, and postal code.' },
            { title: "Add units to the property", desc: 'Open the property → click "Add Unit". Add each apartment/unit with its number, bedrooms, bathrooms, and rent.' },
            { title: "Create your first turnover", desc: 'When a tenant moves out, go to Turnovers → "New Turnover". Select the property, unit, move-out date, and target ready date.' },
            { title: "Add tasks", desc: 'Open the turnover → click "Add task" or "Apply Template" to load a pre-built task list. Track each task to completion.' },
          ]} />
        </Section>

        {/* Section 3 */}
        <div className="page-break" />
        <Section num="3" title="Properties">
          <p className="text-slate-600 leading-relaxed">Properties are your buildings or complexes. Each property contains multiple units.</p>
          <SubSection title="How to add a property">
            <Steps items={[
              { title: "Go to Properties", desc: "Click Properties in the left sidebar." },
              { title: "Click Add Property", desc: "Click the blue Add Property button in the top right." },
              { title: "Fill in the details", desc: "Enter the property name (e.g. Sunset Apartments), full address, city, state, and postal code." },
              { title: "Save", desc: 'Click "Create Property". You will be taken to the property page.' },
            ]} />
          </SubSection>
          <SubSection title="Property page">
            <p className="text-slate-600 text-sm">On the property page you can see: total units, active turnovers, all units with their status, and a list of active turnovers. You can also add units directly from this page.</p>
          </SubSection>
          <InfoBox>
            <strong>Free plan:</strong> You can have 1 property. <strong>Pro plan:</strong> Up to 10 properties. <strong>Business plan:</strong> Unlimited properties.
          </InfoBox>
        </Section>

        {/* Section 4 */}
        <Section num="4" title="Units">
          <p className="text-slate-600 leading-relaxed">Units are the individual apartments or rental spaces inside a property.</p>
          <SubSection title="How to add a unit">
            <Steps items={[
              { title: "Open a property", desc: "Go to Properties and click on a property." },
              { title: "Click Add Unit", desc: "Click the Add Unit button." },
              { title: "Fill in unit details", desc: "Unit number (e.g. 101, A2), number of bedrooms and bathrooms, square footage, and market rent." },
              { title: "Save", desc: "Click Create Unit." },
            ]} />
          </SubSection>
          <SubSection title="Unit statuses">
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                { status: "Vacant", color: "bg-slate-100 text-slate-700", desc: "Empty, not being worked on" },
                { status: "Make-Ready", color: "bg-blue-100 text-blue-700", desc: "Active turnover in progress" },
                { status: "Ready", color: "bg-emerald-100 text-emerald-700", desc: "Work done, ready to lease" },
                { status: "Occupied", color: "bg-purple-100 text-purple-700", desc: "Tenant is living there" },
              ].map((s) => (
                <div key={s.status} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.color}`}>{s.status}</span>
                  <span className="text-slate-600 text-sm">{s.desc}</span>
                </div>
              ))}
            </div>
          </SubSection>
        </Section>

        {/* Section 5 */}
        <div className="page-break" />
        <Section num="5" title="Turnovers">
          <p className="text-slate-600 leading-relaxed">A turnover is created each time a tenant moves out and the unit needs to be made ready for the next tenant. This is the core feature of TurnReady.</p>
          <SubSection title="How to create a turnover">
            <Steps items={[
              { title: "Go to Turnovers", desc: "Click Turnovers in the sidebar." },
              { title: "Click New Turnover", desc: "Click the New Turnover button." },
              { title: "Select the property and unit", desc: "Choose which property and which unit the tenant is leaving." },
              { title: "Set the dates", desc: "Move-out date: when the tenant leaves. Target ready date: when you need the unit ready for the next tenant." },
              { title: "Set priority and status", desc: "Priority: Low, Medium, High, or Urgent. Status: usually starts as Not Started." },
              { title: "Create", desc: "Click Create Turnover. The unit status automatically updates to Make-Ready." },
            ]} />
          </SubSection>
          <SubSection title="Turnover statuses">
            <div className="space-y-2">
              {[
                { status: "Not Started", color: "bg-slate-100 text-slate-700", desc: "Turnover created but work has not begun yet" },
                { status: "In Progress", color: "bg-blue-100 text-blue-700", desc: "Work is actively happening on the unit" },
                { status: "Blocked", color: "bg-red-100 text-red-700", desc: "Something is stopping progress — needs immediate attention" },
                { status: "Ready", color: "bg-emerald-100 text-emerald-700", desc: "All work done, unit is rent-ready" },
              ].map((s) => (
                <div key={s.status} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${s.color}`}>{s.status}</span>
                  <span className="text-slate-600 text-sm">{s.desc}</span>
                </div>
              ))}
            </div>
          </SubSection>
          <InfoBox color="orange">
            <strong>Overdue:</strong> If the target ready date has passed and the turnover is not marked Ready, it will show a red warning. The dashboard will also highlight it. Act quickly to avoid losing rental income.
          </InfoBox>
        </Section>

        {/* Section 6 */}
        <Section num="6" title="Tasks">
          <p className="text-slate-600 leading-relaxed">Tasks are the individual work items inside a turnover. Examples: "Deep clean kitchen", "Paint living room", "Replace carpet", "Change locks".</p>
          <SubSection title="How to add a task">
            <Steps items={[
              { title: "Open a turnover", desc: "Go to Turnovers and click on any turnover." },
              { title: "Click Add task", desc: 'Scroll to the Tasks section and click "+ Add task".' },
              { title: "Fill in task details", desc: "Title (required), description, who it is assigned to, due date, priority, and status." },
              { title: "Save", desc: "Click Add Task. It appears instantly in the list." },
            ]} />
          </SubSection>
          <SubSection title="Managing tasks">
            <div className="space-y-3 text-sm text-slate-600">
              <p>• <strong>Check off a task:</strong> Click the circle icon on the left to mark it Done.</p>
              <p>• <strong>Edit a task:</strong> Hover over the task → click the pencil icon.</p>
              <p>• <strong>Delete a task:</strong> Hover over the task → click the trash icon.</p>
              <p>• <strong>Task progress:</strong> A progress bar at the top of the task section shows how many tasks are done.</p>
            </div>
          </SubSection>
        </Section>

        {/* Section 7 */}
        <div className="page-break" />
        <Section num="7" title="Task Templates">
          <p className="text-slate-600 leading-relaxed">Templates save you time by letting you create a standard task list once and apply it to any turnover with one click.</p>
          <SubSection title="How to create a template">
            <Steps items={[
              { title: "Go to Templates", desc: "Click Templates in the left sidebar." },
              { title: "Click New Template", desc: "Click the New Template button at the bottom." },
              { title: "Name your template", desc: 'Give it a clear name, e.g. "Standard Make-Ready 2BR" or "Studio Turnover".' },
              { title: "Add tasks", desc: "Add each task with a title and priority. You can add as many as you need." },
              { title: "Save Template", desc: "Click Save Template. It is now ready to use." },
            ]} />
          </SubSection>
          <SubSection title="How to apply a template to a turnover">
            <Steps items={[
              { title: "Open a turnover", desc: "Go to Turnovers → click on any turnover." },
              { title: "Click Apply Template", desc: 'In the Tasks section, click the "Apply Template" button.' },
              { title: "Choose your template", desc: "Select the template you want to use." },
              { title: "Done", desc: "All tasks from the template are instantly added to the turnover." },
            ]} />
          </SubSection>
          <InfoBox>
            <strong>Tip:</strong> Create different templates for different unit types — one for studios, one for 1-bedroom, one for 2-bedroom. Each template can have different tasks based on the typical work needed.
          </InfoBox>
          <InfoBox color="orange">
            Task Templates are available on the <strong>Pro and Business plans</strong> only.
          </InfoBox>
        </Section>

        {/* Section 8 */}
        <Section num="8" title="Cost Tracking">
          <p className="text-slate-600 leading-relaxed">Track how much each task costs — both what you expected (estimated) and what you actually paid (actual). This helps you manage budgets and understand your real turnover costs.</p>
          <SubSection title="How to add costs to a task">
            <Steps items={[
              { title: "Open a turnover", desc: "Go to Turnovers → click on a turnover." },
              { title: "Hover over a task", desc: "Move your mouse over any task in the list." },
              { title: "Click the $ icon", desc: "A dollar sign icon appears on the right when you hover." },
              { title: "Enter costs", desc: "Enter the Estimated cost (what you plan to spend) and Actual cost (what you actually paid)." },
              { title: "Save", desc: "Click Save. The task now shows the cost." },
            ]} />
          </SubSection>
          <SubSection title="Cost summary">
            <p className="text-slate-600 text-sm">At the bottom of the task list, TurnReady automatically shows you the <strong>total estimated</strong> vs <strong>total actual</strong> cost for the entire turnover — and whether you are over or under budget.</p>
          </SubSection>
        </Section>

        {/* Section 9 */}
        <div className="page-break" />
        <Section num="9" title="Photo Uploads">
          <p className="text-slate-600 leading-relaxed">Attach photos to any turnover to document the unit condition before and after work, or to record damage and repairs.</p>
          <SubSection title="How to upload photos">
            <Steps items={[
              { title: "Open a turnover", desc: "Go to Turnovers → click on a turnover." },
              { title: "Scroll to Photos section", desc: "The Photos section is below the tasks." },
              { title: "Upload photos", desc: "Click the upload area or drag and drop photos. You can upload multiple at once." },
              { title: "View photos", desc: "Uploaded photos appear in a grid. Click any photo to view it full-size." },
              { title: "Delete photos", desc: "Hover over a photo and click the trash icon to remove it." },
            ]} />
          </SubSection>
          <InfoBox color="orange">
            Photo uploads are available on the <strong>Pro and Business plans</strong> only.
          </InfoBox>
        </Section>

        {/* Section 10 */}
        <Section num="10" title="Team Management">
          <p className="text-slate-600 leading-relaxed">Invite your team members so they can see turnovers, update tasks, and collaborate with you.</p>
          <SubSection title="Team roles">
            <div className="space-y-2">
              {[
                { role: "Owner", color: "bg-violet-100 text-violet-700", desc: "Full access. Can manage billing, team, settings, and all data." },
                { role: "Admin", color: "bg-blue-100 text-blue-700", desc: "Can manage all properties, units, turnovers and team members." },
                { role: "Member", color: "bg-emerald-100 text-emerald-700", desc: "Can view and update turnovers and tasks. Cannot manage team or billing." },
                { role: "Viewer", color: "bg-slate-100 text-slate-700", desc: "Read-only access. Can view everything but cannot make changes." },
              ].map((r) => (
                <div key={r.role} className="flex items-start gap-3 rounded-lg border border-slate-200 p-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${r.color}`}>{r.role}</span>
                  <span className="text-slate-600 text-sm">{r.desc}</span>
                </div>
              ))}
            </div>
          </SubSection>
          <SubSection title="Viewing your team">
            <p className="text-slate-600 text-sm">Go to <strong>Team</strong> in the sidebar to see all team members, their roles, and all recent activity across your workspace.</p>
          </SubSection>
        </Section>

        {/* Section 11 */}
        <div className="page-break" />
        <Section num="11" title="Dashboard">
          <p className="text-slate-600 leading-relaxed">The Dashboard gives you an instant overview of everything happening in your workspace.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { icon: "🔄", title: "Active Turnovers", desc: "How many units are currently in the make-ready process" },
              { icon: "⏰", title: "Overdue", desc: "Turnovers that have passed their target ready date" },
              { icon: "🚫", title: "Blocked", desc: "Turnovers that are stuck and need immediate attention" },
              { icon: "✅", title: "Ready Units", desc: "Units that are done and available to lease" },
            ].map((c) => (
              <div key={c.title} className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
                <span className="text-2xl shrink-0">{c.icon}</span>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{c.title}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <SubSection title="Activity Feed">
            <p className="text-slate-600 text-sm">The right side of the dashboard shows a live activity feed — every action taken in your workspace (tasks completed, turnovers created, status changes) appears here in real-time.</p>
          </SubSection>
        </Section>

        {/* Section 12 */}
        <Section num="12" title="Billing & Plans">
          <p className="text-slate-600 leading-relaxed">TurnReady offers three plans. You can start free and upgrade anytime.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              {
                name: "Free", price: "$0/mo", color: "border-slate-200",
                features: ["1 property", "Up to 5 units", "3 active turnovers", "Basic tasks", "Activity log"],
              },
              {
                name: "Pro", price: "$29/mo", color: "border-blue-400 bg-blue-50",
                features: ["10 properties", "100 units", "Unlimited turnovers", "5 team members", "Photo uploads", "Task templates", "CSV export"],
              },
              {
                name: "Business", price: "$79/mo", color: "border-violet-400",
                features: ["Unlimited everything", "Unlimited team", "Advanced analytics", "Priority support", "Custom branding"],
              },
            ].map((p) => (
              <div key={p.name} className={`rounded-xl border-2 p-5 ${p.color}`}>
                <p className="font-bold text-slate-900">{p.name}</p>
                <p className="text-lg font-bold text-blue-600 mt-1">{p.price}</p>
                <ul className="mt-3 space-y-1.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-500">To upgrade, go to <strong>Billing</strong> in the sidebar and click the Upgrade button for your desired plan.</p>
        </Section>

        {/* Section 13 */}
        <div className="page-break" />
        <Section num="13" title="Tips & Best Practices">
          <div className="space-y-4">
            {[
              {
                icon: "📋",
                title: "Use templates from day one",
                desc: "Create a template called Standard Make-Ready with all the tasks you do for every unit. Apply it every time you create a turnover — never type the same tasks twice.",
              },
              {
                icon: "🚨",
                title: "Set realistic target ready dates",
                desc: "The target ready date is how you measure performance. Set it to your actual goal, not an optimistic guess. Overdue warnings only help you if the dates are accurate.",
              },
              {
                icon: "📸",
                title: "Take before and after photos",
                desc: "Upload photos when the tenant moves out (damage documentation) and when work is complete. This protects you legally and shows the quality of your work.",
              },
              {
                icon: "💰",
                title: "Track costs from the start",
                desc: "Enter estimated costs when you create tasks. Update with actual costs as work is done. After a few turnovers you will know exactly how much each type of unit costs to turn.",
              },
              {
                icon: "🔴",
                title: "Handle blocked turnovers immediately",
                desc: 'If a turnover is marked "Blocked", it means something is stopping progress. Check it every day. A blocked turnover means a unit is sitting vacant and losing money.',
              },
              {
                icon: "👥",
                title: "Assign tasks to specific people",
                desc: "When adding tasks, fill in the Assigned to field with the vendor or staff name. This creates accountability and makes it clear who is responsible for what.",
              },
              {
                icon: "📅",
                title: "Set due dates on tasks",
                desc: "Give each task a due date, not just the overall turnover. This lets you see which tasks are falling behind before the whole turnover is overdue.",
              },
              {
                icon: "🏃",
                title: "Update status as you go",
                desc: 'Change turnover status from "Not Started" to "In Progress" as soon as work begins, and to "Ready" as soon as all work is done. Keep it current so your dashboard is accurate.',
              },
            ].map((tip) => (
              <div key={tip.title} className="flex gap-4 rounded-xl border border-slate-200 p-4">
                <span className="text-2xl shrink-0">{tip.icon}</span>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{tip.title}</p>
                  <p className="text-slate-500 text-sm mt-1 leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-slate-200 text-center">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 mb-4">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <p className="font-semibold text-slate-900">TurnReady</p>
          <p className="text-slate-400 text-sm mt-1">The fastest way to manage unit turnovers</p>
          <p className="text-slate-300 text-xs mt-4">© {new Date().getFullYear()} TurnReady · All rights reserved</p>
        </div>
      </div>
    </div>
  );
}

function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm shrink-0">
          {num}
        </span>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
        <ArrowRight className="h-4 w-4 text-blue-500" />
        {title}
      </h3>
      {children}
    </div>
  );
}

function Steps({ items }: { items: { title: string; desc: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold shrink-0 mt-0.5">
            {i + 1}
          </span>
          <div>
            <p className="font-medium text-slate-900 text-sm">{item.title}</p>
            <p className="text-slate-500 text-sm mt-0.5">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function InfoBox({ children, color = "blue" }: { children: React.ReactNode; color?: "blue" | "orange" }) {
  const styles = {
    blue: "bg-blue-50 border-blue-200 text-blue-900",
    orange: "bg-amber-50 border-amber-200 text-amber-900",
  };
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${styles[color]}`}>
      {children}
    </div>
  );
}

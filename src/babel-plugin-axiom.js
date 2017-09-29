import resolveImport from './resolve-import';

const isSpecialTypes = (types, node) => ['isMemberExpression', 'isProperty']
  .filter((type) => types[type](node)).length > 0;

export default ({ types }) => {
  let axioms;
  let specified;
  let selectedAxioms;

  const importAxiom = (name, file) => {
    if (!selectedAxioms[name]) {
      selectedAxioms[name] = file.addImport(resolveImport(name), 'default');
    }

    return types.clone(selectedAxioms[name]);
  };

  const hasBindingOfType = (scope, name, type) => scope.hasBinding(name) &&
    scope.getBinding(name).path.type === type;

  const matchesAxiom = (path, name) => axioms[name] && (
      hasBindingOfType(path.scope, name, 'ImportDefaultSpecified') ||
      hasBindingOfType(path.scope, name, 'ImportNamespaceSpecifier')
    );

  const matchesAxiomExport = (path, name) => specified[name] &&
    hasBindingOfType(path.scope, name, 'ImportSpecifier');

  return {
    visitor: {
      Program: {
        enter() {
          axioms = Object.create(null);
          specified = Object.create(null);
          selectedAxioms = Object.create(null);
        },
      },

      ImportDeclaration(path) {
        if (path.node.source.value === 'bw-axiom') {
          path.node.specifiers.forEach((spec) => {
            if (types.isImportSpecifier(spec)) {
              specified[spec.local.name] = spec.imported.name;
            } else {
              axioms[spec.local.name] = true;
            }
          });

          path.remove();
        }
      },

      CallExpression(path) {
        if (!types.isIdentifier(path.node.callee)) return;

        if (matchesAxiomExport(path, path.node.callee.name)) {
          path.node.callee = importAxiom(specified[path.node.callee.name], path.hub.file);
        }

        if (path.node.arguments) {
          path.node.arguments = path.node.arguments.map((argument) =>
            matchesAxiomExport(path, path.node.callee.name)
              ? importAxiom(specified[path.node.callee.name])
              : argument
          );
        }
      },

      MemberExpression(path) {
        if (!matchesAxiom(path, path.node.object.name)) return;
        const { type, name } = importAxiom(path.node.property.name, path.hub.file);
        path.replaceWith({ type, name });
      },

      Property(path) {
        if (types.isIdentifier(path.node.key) &&
              path.node.computed &&
              matchesAxiomExport(path, path.node.key.name)) {
          path.node.key = importAxiom(specified[path.node.key.name], path.hub.file);
        }

        if (types.isIdentifier(path.node.value) &&
              matchesAxiomExport(path, path.node.value.name)) {
          path.node.value = importAxiom(specified[path.node.value.name], path.hub.file);
        }
      },

      Identifier(path) {
        if (matchesAxiomExport(path, path.node.name) && !isSpecialTypes(types, path.parent)) {
          const { type, name } = importAxiom(specified[path.node.name], path.hub.file);
          path.replaceWith({ type, name });
        } else if (matchesAxiom(path, path.node.name)) {
          path.replaceWith(types.nullLiteral());
        }
      },
    },
  };
};
